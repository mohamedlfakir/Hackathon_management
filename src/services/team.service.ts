import * as teamApi from "../api/team.api";

import type {
    CreateTeamRequest,
    UpdateTeamRequest,
} from "../api/team.api";

export interface GetTeamsParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

/**
 * Get all teams
 */
export async function getAllTeams(params: GetTeamsParams) {

    const response = await teamApi.getAllTeams(params);

    return response;

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
 * Add a member to a team
 */
export async function addTeamMember(
    teamId: number,
    userId: number
) {
    return await teamApi.addTeamMember(
        teamId,
        userId
    );
}

/**
 * Remove member from a team
 */
export async function removeTeamMember(
    teamId: number,
    userId: number
) {
    return await teamApi.removeTeamMember(
        teamId,
        userId
    );
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


/**
 * Get user's team
 */
export async function getMyTeam(id: number) {

    const response = await teamApi.getMyTeam(id);

    return response.team;

}
