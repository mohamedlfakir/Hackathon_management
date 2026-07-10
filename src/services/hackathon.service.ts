import * as hackathonApi from "../api/hackathon.api";

import {
    type CreateHackathonRequest,
    type UpdateHackathonRequest,
} from "../api/hackathon.api";

export async function getAllHackathons(params?: any) {
    const response = await hackathonApi.getAllHackathons(params);
    return response; 
}

export async function getHackathonById(id: number) {

    const response = await hackathonApi.getHackathonById(id);

    return response.hackathon;

}


/**
 * Get all upcoming hackathons
 */
export async function getUpcomingHackathons() {
    return await hackathonApi.getUpcomingHackathons();
}

/**
 * Get all active hackathons
 */
export async function getActiveHackathons() {
    return await hackathonApi.getActiveHackathons();
}

/**
 * Get authenticated user's active/upcoming hackathons
 */
export async function getMyActiveHackathons() {
    return await hackathonApi.getMyActiveHackathons();
}

/**
 * Get authenticated user's finished hackathons
 */
export async function getMyFinishedHackathons() {
    return await hackathonApi.getMyFinishedHackathons();
}


export async function createHackathon(
    payload: CreateHackathonRequest
) {

    const response = await hackathonApi.createHackathon(
        payload
    );

    return response.hackathon;

}

export async function updateHackathon(
    id: number,
    payload: UpdateHackathonRequest
) {

    const response = await hackathonApi.updateHackathon(
        id,
        payload
    );

    return response.hackathon;

}


export async function assignUserByAdmin(hackathonId: number, userId: number) {

    const response = await hackathonApi.assignUserByAdmin(hackathonId, userId);

    return response.assignment;

}


export async function getSoloParticipants(id: number) {

    const response = await hackathonApi.getSoloParticipants(id);

    return response.participants;

}

export async function getHackathonParticipants(id: number) {

    const response = await hackathonApi.getHackathonParticipants(id);

    return response.participants;

}

export async function assignJudge(
    hackathonId: number,
    judgeId: number
) {

    const response = await hackathonApi.assignJudge(
        hackathonId,
        judgeId
    );

    return response.assignment;

}

export async function removeJudge(
    hackathonId: number,
    judgeId: number
) {

    return await hackathonApi.removeJudge(
        hackathonId,
        judgeId
    );

}

/**
 * Check if the authenticated user is a participant
 */
export async function isParticipant(hackathonId: number) {
    return await hackathonApi.isParticipant(hackathonId);
}   

export async function getHackathonJudges(
    hackathonId: number
) {

    const response = await hackathonApi.getHackathonJudges(
        hackathonId
    );

    return response.judges;

}


export async function getMyAssignedHackathons() {

    const response = await hackathonApi.getMyAssignedHackathons();
    return response;

}

export async function getJudgeHackathons(
    judgeId: number
) {

    const response = await hackathonApi.getJudgeHackathons(
        judgeId
    );

    return response.hackathons;

}


export async function getHackathonTeams(
    hackathonId: number
) {
 
    const response = await hackathonApi.getHackathonTeams(
        hackathonId
    );
 
    return response.teams;
 
}
 
export async function registerTeam(
    hackathonId: number,
    teamId: number
) {
 
    const response = await hackathonApi.registerTeam(
        hackathonId,
        teamId
    );
 
    return response.team;
 
}
 
export async function unregisterTeam(
    hackathonId: number,
    teamId: number
) {
 
    return await hackathonApi.unregisterTeam(
        hackathonId,
        teamId
    );
 
}
 
export async function getHackathonSubmissions(
    hackathonId: number
) {
 
    const response = await hackathonApi.getHackathonSubmissions(
        hackathonId
    );
 
    return response.submissions;
 
}


// Participant registration and management functions

export async function deleteHackathon(id: number) {

    return await hackathonApi.deleteHackathon(id);

}





export async function registerParticipant(id: number) {

    const response = await hackathonApi.registerParticipant(id);

    return response.registration;

}

export async function unregisterParticipant(id: number) {

    return await hackathonApi.unregisterParticipant(id);

}


/**
 * Get hackathon ranking
 */
export async function getHackathonRanking(hackathonId: number) {

    return await hackathonApi.getHackathonRanking(hackathonId);

}

/**
 * Get top 3 submissions of a hackathon
 */
export async function getHackathonWinners(hackathonId: number) {

    return await hackathonApi.getHackathonWinners(hackathonId);

}

/**
 * Get dashboard statistics
 */
export async function getDashboardStatistics() {
    return await hackathonApi.getDashboardStatistics();
}