import * as authApi from "../api/auth.api";
import type {
    LoginRequest,
    RegisterRequest,
    AuthUser,
    AuthResponse
} from "../api/auth.api";

const TOKEN_KEY = "token";
const USER_KEY = "user";

/**
 * Save authentication data
 */
function saveAuth(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Remove authentication data
 */
function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/**
 * Login
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {

    const response = await authApi.login(data);

    saveAuth(response.data.token, response.data.user);

    return response.data;
}

/**
 * Register
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {

    const response = await authApi.register(data);

    saveAuth(response.data.token, response.data.user);

    return response.data;
}

/**
 * Logout
 */
export async function logout(): Promise<void> {

    try {
        await authApi.logout();
    } finally {
        clearAuth();
    }

}

/**
 * Get token from local storage
 */
export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get cached user
 */
export function getStoredUser(): AuthUser | null {

    const user = localStorage.getItem(USER_KEY);

    if (!user) {
        return null;
    }

    return JSON.parse(user);

}

/**
 * Check if a token exists
 */
export function isAuthenticated(): boolean {
    return !!getToken();
}

/**
 * Refresh current user from backend
 */
export async function fetchCurrentUser(): Promise<AuthUser | null> {

    try {

        const response = await authApi.getCurrentUser();

        localStorage.setItem(
            USER_KEY,
            JSON.stringify(response.data)
        );
        console.log("fetchCurrentUser response", response.data);
        return response.data.user;

    } catch {

        clearAuth();

        return null;

    }

}

/**
 * Restore user session
 */
export async function restoreSession(): Promise<AuthUser | null> {

    const token = getToken();

    if (!token) {
        return null;
    }

    return await fetchCurrentUser();

}