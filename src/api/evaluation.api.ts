import api from "./api";

export interface EvaluationScore {
    criterion_id: number;
    score: number;
}

export interface Evaluation {
    id: number;
    submission_id: number;
    judge_id: number;
    comments: string;
    scores: EvaluationScore[];
    created_at: string;
    updated_at: string;
}

export interface CreateEvaluationRequest {
    submission_id: number;
    comments: string;
    scores: EvaluationScore[];
}

export interface UpdateEvaluationRequest {
    comments: string;
    scores: EvaluationScore[];
}

/**
 * GET /evaluations
 */
export async function getAllEvaluations() {

    const { data } = await api.get("/evaluations");

    return data;

}

/**
 * GET /evaluations/:id
 */
export async function getEvaluationById(id: number) {

    const { data } = await api.get(`/evaluations/${id}`);

    return data;

}

/**
 * GET /evaluations/submission/:submissionId
 */
export async function getSubmissionEvaluations(
    submissionId: number
) {

    const { data } = await api.get(
        `/evaluations/submission/${submissionId}`
    );

    return data;

}

/**
 * POST /evaluations
 */
export async function createEvaluation(
    payload: CreateEvaluationRequest
) {

    const { data } = await api.post(
        "/evaluations",
        payload
    );

    return data;

}

/**
 * PUT /evaluations/:id
 */
export async function updateEvaluation(
    id: number,
    payload: UpdateEvaluationRequest
) {

    const { data } = await api.put(
        `/evaluations/${id}`,
        payload
    );

    return data;

}

/**
 * DELETE /evaluations/:id
 */
export async function deleteEvaluation(
    id: number
) {

    const { data } = await api.delete(
        `/evaluations/${id}`
    );

    return data;

}