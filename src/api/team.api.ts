import api from "./api";

export interface Team {
    id: number;
    name: string;
    description: string;
    avatar?: string | null;
    hackathon_id: number;
    leader_id: number;
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

/**
 * GET /teams
 */
export async function getAllTeams() {

    const { data } = await api.get("/teams");

    return data;

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
 * POST /teams/:id/join
 */
export async function joinTeam(id: number) {

    const { data } = await api.post(
        `/teams/${id}/join`
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