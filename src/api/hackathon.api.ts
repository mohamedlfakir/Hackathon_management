import api from "./api";

export interface Hackathon {
    id: number;
    title: string;
    description: string;
    theme: string;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    rules: string;
    location: string;
    is_online: boolean;
    max_team_size: number;
    status: HackathonStatus;
    created_by: number;
    created_at: string;
    updated_at: string;
}

export type HackathonStatus = "OPEN" | "CLOSED" | "FINISHED" | "UPCOMING";

export interface CreateHackathonRequest {
    title: string;
    description: string;
    theme: string;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    max_team_size: number;
    rules?: string;
    location?: string;
    is_online?: boolean;    
}

export interface UpdateHackathonRequest {
    title?: string;
    description?: string;
    theme?: string;
    start_date?: string;
    end_date?: string;
    registration_deadline?: string;
    max_team_size?: number;
    status?: HackathonStatus;
    rules?: string;
    location?: string;
    is_online?: boolean;
}

export interface JudgeAssignmentRequest {
    judge_id: number;
}

export async function getAllHackathons(params?: any) {
    const { data } = await api.get("/hackathons", { params });
    return data;
}

export async function getHackathonById(id: number) {

    const { data } = await api.get(`/hackathons/${id}`);

    return data;

}

export async function createHackathon(
    payload: CreateHackathonRequest
) {

    const { data } = await api.post(
        "/hackathons",
        payload
    );

    return data;

}

export async function updateHackathon(
    id: number,
    payload: UpdateHackathonRequest
) {

    const { data } = await api.put(
        `/hackathons/${id}`,
        payload
    );

    return data;

}

export async function deleteHackathon(id: number) {

    const { data } = await api.delete(
        `/hackathons/${id}`
    );

    return data;

}

export async function registerParticipant(id: number) {

    const { data } = await api.post(
        `/hackathons/${id}/register`
    );

    return data;

}

export async function unregisterParticipant(id: number) {

    const { data } = await api.delete(
        `/hackathons/${id}/register`
    );

    return data;

}

export async function getSoloParticipants(id: number) {

    const { data } = await api.get(
        `/hackathons/${id}/solo-participants`
    );

    return data;

}

export async function assignJudge(
    hackathonId: number,
    judgeId: number
) {

    const { data } = await api.post(
        `/hackathons/${hackathonId}/assign-judge`,
        {
            judge_id: judgeId,
        }
    );

    return data;

}

export async function removeJudge(
    hackathonId: number,
    judgeId: number
) {

    const { data } = await api.delete(
        `/hackathons/${hackathonId}/remove-judge/${judgeId}`
    );

    return data;

}

export async function getHackathonJudges(
    hackathonId: number
) {

    const { data } = await api.get(
        `/hackathons/${hackathonId}/judges`
    );

    return data;

}

export async function getJudgeHackathons(
    judgeId: number
) {

    const { data } = await api.get(
        `/hackathons/judges/${judgeId}/hackathons`
    );

    return data;

}

/**
 * Teams 
 * 
 * 
 */
export async function getHackathonTeams(hackathonId: number) {
 
    const { data } = await api.get(
        `/hackathons/${hackathonId}/teams`
    );
 
    return data;
 
}
 
export async function getHackathonParticipants(hackathonId: number) {
    const { data } = await api.get(
        `/hackathons/${hackathonId}/participants`
    );

    return data;
}

export async function registerTeam(
    hackathonId: number,
    teamId: number
) {
 
    const { data } = await api.post(
        `/hackathons/${hackathonId}/teams`,
        { team_id: teamId }
    );
 
    return data;
 
}
 
export async function unregisterTeam(
    hackathonId: number,
    teamId: number
) {
 
    const { data } = await api.delete(
        `/hackathons/${hackathonId}/teams/${teamId}`
    );
 
    return data;
 
}
 
/**
 * Submissions
 * 
 */
export async function getHackathonSubmissions(hackathonId: number) {
 
    const { data } = await api.get(
        `/hackathons/${hackathonId}/submissions`
    );
 
    return data;
 
}