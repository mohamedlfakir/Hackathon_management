import api from "./api";

export interface EvaluationItem  {
    criterion_id: number;
    score: number;
}

export interface EvaluationCriterion {
  id: number;
  code: string;
  name: string;
  max_score: number;
}

export interface Evaluation {
    id: number;
    submission_id: number;
    judge_id: number;
    comments: string;
    scores: EvaluationItem[];
    created_at: string;
    updated_at: string;
}

export interface SubmitEvaluationRequest {
    submission_id: number;
    comments: string;
    scores: EvaluationItem[];
}

export interface UpdateEvaluationRequest {
    comments: string;
    scores: EvaluationItem[];
}
/**
 * GET /evaluations/criteria
 */
export async function getEvaluationCriteria() {

    const { data } = await api.get("/evaluations/criteria");

    return data;

}

/**
 * POST /submissions/:submissionId/evaluations
 */
export async function submitEvaluation(
    submissionId: string,
    evaluations: {
        criterion_id: number;
        score: number;
        comment?: string;
    }[]
) {

    const { data } = await api.post(
        `/evaluations/${submissionId}`,
        {
            evaluations
        }
    );

    return data;

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
        `/evaluations/submissions/${submissionId}`
    );

    return data;

}

/**
 * GET /evaluations/submission/:submissionId
 */
export async function getMyEvaluations(
    submissionId: number
) {

    const { data } = await api.get(
        `/evaluations/submissions/${submissionId}/my-evaluation`
    );

    return data;

}

/**
 * POST /evaluations
 */
/*
export async function submitEvaluation(
    payload: SubmitEvaluationRequest
) {

    const { data } = await api.post(
        "/evaluations",
        payload
    );

    return data;

}*/

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

/**
 * Get pending submissions of a judge
 */
export async function getJudgePendingSubmissions(
    judgeId: number
) {
    const { data } = await api.get(
        `/evaluations/judges/${judgeId}/pending-submissions`
    );

    return data;
}

/**
 * Get pending submissions count of a judge
 */
export async function getJudgePendingSubmissionsCount(
    judgeId: number
) {
    const { data } = await api.get(
        `/evaluations/judges/${judgeId}/pending-submissions/count`
    );

    return data;
}

/**
 * Get evaluated submissions of a judge
 */
export async function getJudgeEvaluatedSubmissions(
    judgeId: number
) {
    const { data } = await api.get(
        `/evaluations/judges/${judgeId}/evaluated-submissions`
    );

    return data;
}

/**
 * Get evaluated submissions count of a judge
 */
export async function getJudgeEvaluatedSubmissionsCount(
    judgeId: number
) {
    const { data } = await api.get(
        `/evaluations/judges/${judgeId}/evaluated-submissions/count`
    );

    return data;
}

/**
 * Get my pending submissions
 */
export async function getMyPendingSubmissions() {
    const { data } = await api.get(
        "/evaluations/my/pending-submissions"
    );

    return data;
}

/**
 * Get my pending submissions count
 */
export async function getMyPendingSubmissionsCount() {
    const { data } = await api.get(
        "/evaluations/my/pending-submissions/count"
    );

    return data;
}

/**
 * Get my evaluated submissions
 */
export async function getMyEvaluatedSubmissions() {
    const { data } = await api.get(
        "/evaluations/my/evaluated-submissions"
    );

    return data;
}

/**
 * Get my evaluated submissions count
 */
export async function getMyEvaluatedSubmissionsCount() {
    const { data } = await api.get(
        "/evaluations/my/evaluated-submissions/count"
    );

    return data;
}