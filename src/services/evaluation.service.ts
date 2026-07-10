import * as evaluationApi from "../api/evaluation.api";

import type {
    SubmitEvaluationRequest,
    UpdateEvaluationRequest,
    EvaluationCriterion,
    EvaluationItem
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
 * Get judge evaluations of a submission
 */
export async function getMyEvaluations(
    submissionId: number
) {

    const response = await evaluationApi.getMyEvaluations(
        submissionId
    );

    return response.evaluation;

}

/**
 * Get evaluation criteria
 */
export async function getEvaluationCriteria() {

   const response = await evaluationApi.getEvaluationCriteria();

    return response.criteria;

}

/**
 * Evaluate a submission
 */
export async function submitEvaluation(
    submissionId: string,
    evaluations: {
        criterion_id: number;
        score: number;
        comment?: string;
    }[]
) {

    return await evaluationApi.submitEvaluation(
        submissionId,
        evaluations
    );

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