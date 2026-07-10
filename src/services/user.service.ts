import * as userApi from "../api/user.api";

import type {
    CreateUserRequest,
    UpdateProfileRequest,
    UpdateRoleRequest,
    GetUsersParams,
} from "../api/user.api";

/**
 * Get a page of users (search / filter / sort / pagination)
 */
export async function getAllUsers(
    params?: GetUsersParams
) {

    const response = await userApi.getAllUsers(
        params
    );

    return response;

}

/**
 * Get user by id
 */
export async function getUserById(
    id: number
) {

    const response = await userApi.getUserById(
        id
    );

    return response.user;

}

/**
 * Create user
 */
export async function createUser(
    payload: CreateUserRequest
) {

    const response = await userApi.createUser(
        payload
    );

    return response.user;

}

/**
 * Update user profile fields
 */
export async function updateUser(
    id: number,
    payload: UpdateProfileRequest
) {

    const response = await userApi.updateUser(
        id,
        payload
    );

    return response.user;

}


/**
 * Get authenticated user profile
 */
export async function getMe() {
    return await userApi.getMe();
}

/**
 * Update authenticated user profile
 */
export async function updateProfile(profile: {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}) {
    return await userApi.updateProfile(profile);
}

/**
 * Change authenticated user password
 */
export async function changePassword(passwords: {
    current_password: string;
    new_password: string;
}) {
    return await userApi.changePassword(passwords);
}

/**
 * Update authenticated user avatar
 */
export async function updateAvatar(file: File) {
    return await userApi.updateAvatar(file);
}

/**
 * 
 * Update user role
 */
export async function updateUserRole(
    id: number,
    payload: UpdateRoleRequest
) {

    const response = await userApi.updateRole(
        id,
        payload.role
    );

    return response.user;

}

/**
 * Delete user
 */
export async function deleteUser(
    id: number
) {

    return await userApi.deleteUser(
        id
    );

}