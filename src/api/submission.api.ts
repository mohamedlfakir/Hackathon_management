import api from "./api";

export interface Submission {
    id: number;
    title: string;
    team_name:string;
    description: string;
    github_url?: string | null;
    figma_url?: string | null;
    presentation_path?: string | null;
    team_id: number;
    user_id: number;
    hackathon_id: number;
    submitted_at: string;
    created_at: string;
    updated_at: string;
}

export interface CreateSubmissionRequest {
    title: string;
    description: string;
    github_url?: string;
    figma_url?: string;
    hackathon_id: number
}

export interface UpdateSubmissionRequest {
    title?: string;
    description?: string;
    github_url?: string;
    figma_url?: string;
    hackathon_id: number
}

/**
 * GET /submissions
 */
export async function getAllSubmissions() {

    const { data } = await api.get("/submissions");

    return data;

}

/**
 * GET /submissions/:id
 */
export async function getSubmissionById(id: number) {

    const { data } = await api.get(`/submissions/${id}`);

    return data;

}

/**
 * Get my submission for a hackathon
 */
export async function getMySubmission(
    hackathonId: number
) {
    const { data } = await api.get(
        `/submissions/hackathons/${hackathonId}/my-submission`
    );

    return data;
}

/**
 * POST /submissions
 */
export async function createSubmission(
    payload: CreateSubmissionRequest
) {

    const { data } = await api.post(
        "/submissions",
        payload
    );

    return data;

}

/**
 * PUT /submissions/:id
 */
export async function updateSubmission(
    id: number,
    payload: UpdateSubmissionRequest
) {

    const { data } = await api.put(
        `/submissions/${id}`,
        payload
    );

    return data;

}

/**
 * DELETE /submissions/:id
 */
export async function deleteSubmission(id: number) {

    const { data } = await api.delete(
        `/submissions/${id}`
    );

    return data;

}

/**
 * PUT /submissions/:id/github
 */
export async function updateGithubUrl(
    id: number,
    github_url: string
) {

    const { data } = await api.put(
        `/submissions/${id}/github`,
        {
            github_url,
        }
    );

    return data;

}

/**
 * PUT /submissions/:id/figma
 */
export async function updateFigmaUrl(
    id: number,
    figma_url: string
) {

    const { data } = await api.put(
        `/submissions/${id}/figma`,
        {
            figma_url,
        }
    );

    return data;

}

/**
 * PUT /submissions/:id/presentation
 */
export async function updatePresentation(
    id: number,
    file: File
) {

    const formData = new FormData();

    formData.append(
        "presentation",
        file
    );

    const { data } = await api.put(
        `/submissions/${id}/presentation`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return data;
}

