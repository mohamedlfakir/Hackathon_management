import * as teamApi from "../api/team.api";

import type {
    CreateTeamRequest,
    UpdateTeamRequest,
} from "../api/team.api";

/**
 * Get all teams
 */
export async function getAllTeams() {

    const response = await teamApi.getAllTeams();

    return response.teams;

}

/**
 * Get team by id
 */
export async function getTeamById(id: number) {

    const response = await teamApi.getTeamById(id);

    return response.team;

}

/**
 * Create team
 */
export async function createTeam(
    payload: CreateTeamRequest
) {

    const response = await teamApi.createTeam(
        payload
    );

    return response.team;

}

/**
 * Update team
 */
export async function updateTeam(
    id: number,
    payload: UpdateTeamRequest
) {

    const response = await teamApi.updateTeam(
        id,
        payload
    );

    return response.team;

}

/**
 * Delete team
 */
export async function deleteTeam(id: number) {

    return await teamApi.deleteTeam(id);

}

/**
 * Join team
 */
export async function joinTeam(id: number) {

    const response = await teamApi.joinTeam(id);

    return response.membership;

}

/**
 * Leave team
 */
export async function leaveTeam(id: number) {

    return await teamApi.leaveTeam(id);

}

/**
 * Get team members
 */
export async function getMembers(id: number) {

    const response = await teamApi.getMembers(id);

    return response.members;

}

/**
 * Update team avatar
 */
export async function updateAvatar(
    id: number,
    file: File
) {

    const response = await teamApi.updateAvatar(
        id,
        file
    );

    return response.team;

}