import * as evaluationApi from "../api/evaluation.api";

import type {
    CreateEvaluationRequest,
    UpdateEvaluationRequest,
} from "../api/evaluation.api";

/**
 * Get all evaluations
 */
export async function getAllEvaluations() {

    const response = await evaluationApi.getAllEvaluations();

    return response.evaluations;

}

/**
 * Get evaluation by id
 */
export async function getEvaluationById(
    id: number
) {

    const response = await evaluationApi.getEvaluationById(
        id
    );

    return response.evaluation;

}

/**
 * Get all evaluations of a submission
 */
export async function getSubmissionEvaluations(
    submissionId: number
) {

    const response = await evaluationApi.getSubmissionEvaluations(
        submissionId
    );

    return response.evaluations;

}

/**
 * Create evaluation
 */
export async function createEvaluation(
    payload: CreateEvaluationRequest
) {

    const response = await evaluationApi.createEvaluation(
        payload
    );

    return response.evaluation;

}

/**
 * Update evaluation
 */
export async function updateEvaluation(
    id: number,
    payload: UpdateEvaluationRequest
) {

    const response = await evaluationApi.updateEvaluation(
        id,
        payload
    );

    return response.evaluation;

}

/**
 * Delete evaluation
 */
export async function deleteEvaluation(
    id: number
) {

    return await evaluationApi.deleteEvaluation(
        id
    );

}