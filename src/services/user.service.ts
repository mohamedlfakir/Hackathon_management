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