import * as submissionApi from "../api/submission.api";

import type {
    CreateSubmissionRequest,
    UpdateSubmissionRequest,
} from "../api/submission.api";

/**
 * Get all submissions
 */
export async function getAllSubmissions() {

    const response = await submissionApi.getAllSubmissions();

    return response.submissions;

}

/**
 * Get submission by id
 */
export async function getSubmissionById(id: number) {

    const response = await submissionApi.getSubmissionById(id);

    return response.submission;

}

/**
 * Get my submission for a hackathon
 */
export async function getMySubmission(
    hackathonId: number
) {
    return await submissionApi.getMySubmission(
        hackathonId
    );
}

/**
 * Create submission
 */
export async function createSubmission(
    payload: CreateSubmissionRequest
) {

    const response = await submissionApi.createSubmission(
        payload
    );

    return response.submission;

}

/**
 * Update submission
 */
export async function updateSubmission(
    id: number,
    payload: UpdateSubmissionRequest
) {

    const response = await submissionApi.updateSubmission(
        id,
        payload
    );

    return response.submission;

}

/**
 * Delete submission
 */
export async function deleteSubmission(id: number) {

    return await submissionApi.deleteSubmission(id);

}

/**
 * Update GitHub URL
 */
export async function updateGithubUrl(
    id: number,
    github_url: string
) {

    const response = await submissionApi.updateGithubUrl(
        id,
        github_url
    );

    return response.submission;

}

/**
 * Update Figma URL
 */
export async function updateFigmaUrl(
    id: number,
    figma_url: string
) {

    const response = await submissionApi.updateFigmaUrl(
        id,
        figma_url
    );

    return response.submission;

}

/**
 * Upload presentation
 */
export async function updatePresentation(
    id: number,
    file: File
) {

    const response = await submissionApi.updatePresentation(
        id,
        file
    );

    return response.submission;

}

