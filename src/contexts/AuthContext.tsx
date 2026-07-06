import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import * as authService from "../services/auth.service";

import type {
    AuthUser,
    LoginRequest,
    RegisterRequest,
} from "../api/auth.api";

interface AuthContextType {

    user: AuthUser | null;

    loading: boolean;

    isAuthenticated: boolean;

    login: (data: LoginRequest) => Promise<void>;

    register: (data: RegisterRequest) => Promise<void>;

    logout: () => Promise<void>;

    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {

    children: ReactNode;

}

export function AuthProvider({
    children,
}: AuthProviderProps): React.JSX.Element {  

    const [user, setUser] = useState<AuthUser | null>(null);

    const [loading, setLoading] = useState(true);

    /**
     * Restore session on application startup
     */
    useEffect(() => {

        async function initialize() {

            try {

                const currentUser = await authService.restoreSession();

                setUser(currentUser);

            } finally {

                setLoading(false);

            }

        }

        initialize();

    }, []);

    /**
     * Login
     */
    async function login(data: LoginRequest) {

        const result = await authService.login(data);

        setUser(result.user);

    }

    /**
     * Register
     */
    async function register(data: RegisterRequest) {

        const result = await authService.register(data);

        setUser(result.user);

    }

    /**
     * Logout
     */
    async function logout() {

        await authService.logout();

        setUser(null);

    }

    /**
     * Refresh user
     */
    async function refreshUser() {

        const currentUser = await authService.fetchCurrentUser();

        setUser(currentUser);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                refreshUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth(): AuthContextType {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used within an AuthProvider"
        );

    }

    return context;

}