import api from "./api";
import type { User } from "./user.api";

export interface Team {
    id: number;
    name: string;
    description: string;
    avatar_url?: string | null;
    hackathon_id: number;
    hackathon_title: string;
    leader_id: number;
    leader: User;
    members: User[];
    created_at: string;
    updated_at: string;
}

export interface CreateTeamRequest {
    name: string;
    description: string;
    hackathon_id: number;
}

export interface UpdateTeamRequest {
    name?: string;
    description?: string;
}

export interface GetTeamsResponse {
    teams: Team[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

/**
 * GET /teams
 */
export async function getAllTeams(params?: any) {

    const response = await api.get<GetTeamsResponse>("/teams", { params });

    return response.data;

}

/**
 * GET /teams/:id
 */
export async function getTeamById(id: number) {

    const { data } = await api.get(`/teams/${id}`);

    return data;

}

/**
 * POST /teams
 */
export async function createTeam(
    payload: CreateTeamRequest
) {

    const { data } = await api.post(
        "/teams",
        payload
    );

    return data;

}

/**
 * PUT /teams/:id
 */
export async function updateTeam(
    id: number,
    payload: UpdateTeamRequest
) {

    const { data } = await api.put(
        `/teams/${id}`,
        payload
    );

    return data;

}

/**
 * DELETE /teams/:id
 */
export async function deleteTeam(id: number) {

    const { data } = await api.delete(
        `/teams/${id}`
    );

    return data;

}

/**
 * Add a member to a team
 */
export async function addTeamMember(
    teamId: number,
    userId: number
) {
    const { data } = await api.post(
        `/teams/${teamId}/add-member`,
        {
            user_id: userId,
        }
    );

    return data;
}

/**
 * Remove member from a team
 */
export async function removeTeamMember(
    teamId: number,
    userId: number
) {
    const { data } = await api.delete(
        `/teams/${teamId}/members/${userId}`
    );

    return data;
}


/**
 * DELETE /teams/:id/leave
 */
export async function leaveTeam(id: number) {

    const { data } = await api.delete(
        `/teams/${id}/leave`
    );

    return data;

}

/**
 * GET /teams/:id/members
 */
export async function getMembers(id: number) {

    const { data } = await api.get(
        `/teams/${id}/members`
    );

    return data;

}

/**
 * PUT /teams/:id/avatar
 */
export async function updateAvatar(
    id: number,
    file: File
) {

    const formData = new FormData();

    formData.append("avatar", file);

    const { data } = await api.put(
        `/teams/${id}/avatar`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;

}


export async function getMyTeam(hackathonId: number) {
    const { data } = await api.get(
        `/teams/hackathons/${hackathonId}/my-team`
    );

    return data;
}