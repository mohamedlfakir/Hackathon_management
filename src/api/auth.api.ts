import api from "./api";

/**
 * Request Interfaces
 */

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

/**
 * Response Interfaces
 */

export interface AuthUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email?: string;
    role: "ADMIN" | "PARTICIPANT" | "JUDGE" | "ORGANIZER";
    bio?: string | null;
    avatar_path?: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: AuthUser;
}

export interface UserResponse {
    success: boolean;
    user: AuthUser;
}
/**
 * Login
 */
export const login = (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data);

/**
 * Register
 */
export const register = (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data);

/**
 * Get currently authenticated user
 * (Requires Authorization header)
 */
export const getCurrentUser = () =>
    api.get<UserResponse>("/users/me");

/**
 * Refresh current user
 * (Alias of getCurrentUser for readability)
 */
export const refreshUser = () =>
    getCurrentUser();

/**
 * Logout
 *
 * JWT logout is handled on the frontend by
 * removing the token. This function exists
 * in case you later implement refresh tokens
 * or server-side logout.
 */
export const logout = () =>
    Promise.resolve();