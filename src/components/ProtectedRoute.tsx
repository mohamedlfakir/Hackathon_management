import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type UserRole = "ADMIN" | "JUDGE" | "PARTICIPANT" | "MANAGER";

interface ProtectedRouteProps {
    children: ReactNode;
    roles?: UserRole[];
}

export default function ProtectedRoute({
    children,
    roles,
}: ProtectedRouteProps): React.JSX.Element {

    const { user, loading } = useAuth();

    const location = useLocation();

    /**
     * Wait until the authentication state is restored.
     */
    if (loading) {

        return (
            <div className="flex items-center justify-center h-screen">
                <span className="text-lg font-medium">
                    Loading...
                </span>
            </div>
        );

    }


    /**
     * User is not logged in.
     */
    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );

    }
    /**
     * User doesn't have the required role.
     */
    if (
        roles &&
        roles.length > 0 &&
        !roles.includes(user?.role as UserRole)
    ) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }

    /**
     * Access granted.
     */
    return <>{children}</>;

}