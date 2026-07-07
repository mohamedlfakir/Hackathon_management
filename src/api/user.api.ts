import api from "./api";

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: "ADMIN" | "JUDGE" | "PARTICIPANT" | "ORGANIZER";
    avatar?: string | null;
    created_at: string;
    updated_at: string;
}

export interface UpdateProfileRequest {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
}

export interface ChangePasswordRequest {
    current_password: string;
    new_password: string;
}

export interface CreateUserRequest {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: "ADMIN" | "JUDGE" | "PARTICIPANT" | "ORGANIZER";
}
 
export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: User["role"];
    sort_by?: "username" | "email" | "role" | "created_at";
    sort_order?: "asc" | "desc";
}
 
export interface GetUsersResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface UpdateRoleRequest {
    role: "ADMIN" | "JUDGE" | "PARTICIPANT" | "ORGANIZER";
}

/**
 * Get a page of users, optionally searched / filtered / sorted.
 */
export async function getAllUsers(
    params?: GetUsersParams
) {
 
    const response = await api.get<GetUsersResponse>(
        "/users",
        { params }
    );
 
    return response.data;
 
}

/**
 * GET /users/:id
 */
export async function getUserById(id: number) {

    const { data } = await api.get(`/users/${id}`);

    return data;

}

/**
 * GET /users/me
 */
export async function getMe() {

    const { data } = await api.get("/users/me");

    return data;

}

/**
 * PUT /users/me
 */
export async function updateProfile(
    payload: UpdateProfileRequest
) {

    const { data } = await api.put(
        "/users/me",
        payload
    );

    return data;

}

/**
 * PUT /users/me/password
 */
export async function changePassword(
    payload: ChangePasswordRequest
) {

    const { data } = await api.put(
        "/users/me/password",
        payload
    );

    return data;

}

/**
 * PUT /users/me/avatar
 */
export async function updateAvatar(
    file: File
) {

    const formData = new FormData();

    formData.append("avatar", file);

    const { data } = await api.put(
        "/users/me/avatar",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;

}


/**
 * Create user
 */
export async function createUser(
    payload: CreateUserRequest
) {
 
    const response = await api.post<{ user: User }>(
        "/users",
        payload
    );
 
    return response.data;
 
}

/**
 * Update user profile fields
 */
export async function updateUser(
    id: number,
    payload: UpdateProfileRequest
) {
 
    const response = await api.put<{ user: User }>(
        `/users/${id}`,
        payload
    );
 
    return response.data;
 
}
 

/**
 * PUT /users/:id/role
 */
export async function updateRole(
    id: number,
    role: UpdateRoleRequest["role"]
) {

    const { data } = await api.put(
        `/users/${id}/role`,
        { role }
    );

    return data;

}

/**
 * DELETE /users/:id
 */
export async function deleteUser(id: number) {

    const { data } = await api.delete(
        `/users/${id}`
    );

    return data;

}