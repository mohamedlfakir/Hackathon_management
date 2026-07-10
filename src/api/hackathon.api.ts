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

export interface RankedSubmissionItem {
  id: number;
  title: string;
  team_id: number | null;
  team_name: string | null;
  user_id: number | null;
  first_name?: string;
  last_name?: string;
  judges_count: number;
  total_score: number;
  average_score: number;
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


/**
 * Get all upcoming hackathons
 */
export async function getUpcomingHackathons() {
    const { data } = await api.get(
        "/hackathons/upcoming"
    );

    return data;
}

/**
 * Get all active hackathons
 */
export async function getActiveHackathons() {
    const { data } = await api.get(
        "/hackathons/active"
    );

    return data;
}

/**
 * Get authenticated user's active/upcoming hackathons
 */
export async function getMyActiveHackathons() {
    const { data } = await api.get(
        "/hackathons/my/active"
    );

    return data;
}

/**
 * Get authenticated user's finished hackathons
 */
export async function getMyFinishedHackathons() {
    const { data } = await api.get(
        "/hackathons/my/finished"
    );

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


export async function assignUserByAdmin(hackathonId: number, userId: number) {

    const { data } = await api.post(
        `/hackathons/${hackathonId}/assign-user`,
        { userId: userId }
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
        `/hackathons/${hackathonId}/judges`,
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
        `/hackathons/${hackathonId}/judges/${judgeId}`
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



export async function getMyAssignedHackathons() {

    const { data } = await api.get(
        `/hackathons/judges/my`
    );

    return data;

}

export async function getJudgeHackathons(
    judgeId: number
) {

    const { data } = await api.get(
        `/hackathons/judges/${judgeId}`
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

/**
 * Check if the authenticated user is a participant
 */
export async function isParticipant(hackathonId: number) {
    const { data } = await api.get(
        `/hackathons/${hackathonId}/is-participant`
    );
    return data;
}

/**
 * GET /evaluations/hackathons/:hackathonId/ranking
 */
export async function getHackathonRanking(hackathonId: number) {

    const { data } = await api.get(
        `/submissions/${hackathonId}/ranking`
    );

    return data;

}

/**
 * GET /evaluations/hackathons/:hackathonId/top-submissions
 */
export async function getHackathonWinners(hackathonId: number) {

    const { data } = await api.get(
        `/submissions/${hackathonId}/top-submissions`
    );

    return data;

}

/**
 * Get dashboard statistics
 */
export async function getDashboardStatistics() {
    const { data } = await api.get(
        "/dashboard/statistics"
    );

    return data;
}
