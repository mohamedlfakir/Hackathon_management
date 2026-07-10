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


/**
 * Get pending submissions of a judge
 */
export async function getJudgePendingSubmissions(
    judgeId: number
) {
    return await evaluationApi.getJudgePendingSubmissions(
        judgeId
    );
}

/**
 * Get pending submissions count of a judge
 */
export async function getJudgePendingSubmissionsCount(
    judgeId: number
) {
    return await evaluationApi.getJudgePendingSubmissionsCount(
        judgeId
    );
}

/**
 * Get evaluated submissions of a judge
 */
export async function getJudgeEvaluatedSubmissions(
    judgeId: number
) {
    return await evaluationApi.getJudgeEvaluatedSubmissions(
        judgeId
    );
}

/**
 * Get evaluated submissions count of a judge
 */
export async function getJudgeEvaluatedSubmissionsCount(
    judgeId: number
) {
    return await evaluationApi.getJudgeEvaluatedSubmissionsCount(
        judgeId
    );
}

/**
 * Get my pending submissions
 */
export async function getMyPendingSubmissions() {
    return await evaluationApi.getMyPendingSubmissions();
}

/**
 * Get my pending submissions count
 */
export async function getMyPendingSubmissionsCount() {
    return await evaluationApi.getMyPendingSubmissionsCount();
}

/**
 * Get my evaluated submissions
 */
export async function getMyEvaluatedSubmissions() {
    return await evaluationApi.getMyEvaluatedSubmissions();
}

/**
 * Get my evaluated submissions count
 */
export async function getMyEvaluatedSubmissionsCount() {
    return await evaluationApi.getMyEvaluatedSubmissionsCount();
}