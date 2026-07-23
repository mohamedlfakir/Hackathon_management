import { useState, useEffect, useCallback } from "react";
import * as submissionService from "../services/submission.service";

export interface Submission {
  id: number;
  title: string;
  team_id: number;
  team_name: string;
  hackathon_id: number;
  hackathon_title: string;
  is_evaluated: boolean;
  score?: number;
  demo_url?: string;
  submitted_at: string;
  evaluation_status: string;
  username: string;
  first_name: string,
  last_name: string,
  email: string,
}

export type SortableSubmissionColumn =
  | "title"
  | "team_name"
  | "hackathon"
  | "score"
  | "submitted_at";

export type StatusFilter = 'ALL' | 'UNEVALUATED' | 'IN_PROGRESS' | 'COMPLETED';

interface UseSubmissionsOptions {
  pageSize?: number;
}

export function useSubmissions(options: UseSubmissionsOptions = {}) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(options.pageSize || 10);
  const [search, setSearch] = useState("");
  const [hackathonFilter, setHackathonFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortBy, setSortBy] = useState<SortableSubmissionColumn>("submitted_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch function
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await submissionService.getAllSubmissions({
        page,
        limit,
        search,
        hackathon_id: hackathonFilter === "ALL" ? undefined : Number(hackathonFilter),
        status: statusFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      });

      setSubmissions(response.data);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / limit) || 1);
    } catch (err: any) {
      console.error("Error loading submissions:", err);
      setError(
        err.response?.data?.message ||
          "Impossible de charger les soumissions. Veuiller réessayer."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, hackathonFilter, statusFilter, sortBy, sortOrder]);

  // Trigger re-fetch when parameters change
  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setPage(1);
  }, [search, hackathonFilter, statusFilter]);

  // Toggle sorting logic
  const toggleSort = (column: SortableSubmissionColumn) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Delete submission function
  const deleteSubmission = async (id: number) => {
    await submissionService.deleteSubmission(id);
    await fetchSubmissions();
  };

  return {
    submissions,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    hackathonFilter,
    setHackathonFilter,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch: fetchSubmissions,
    deleteSubmission,
  };
}