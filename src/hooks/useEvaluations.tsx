import { useState, useEffect, useCallback } from "react";

export interface Evaluation {
  id: string;
  submission_title: string;
  demo_url?: string;
  team_name?: string;
  author_name?: string;
  hackathon_id?: string;
  hackathon_title: string;
  judge_id?: string;
  judge_name?: string;
  judge_username?: string;
  score?: number;
  evaluated_at: string;
}

export type SortableColumn = "title" | "judge" | "hackathon" | "score" | "evaluated_at";

interface UseEvaluationsOptions {
  pageSize?: number;
}

export function useEvaluations({ pageSize = 10 }: UseEvaluationsOptions = {}) {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(pageSize);

  // Filtres & Recherche
  const [search, setSearch] = useState<string>("");
  const [hackathonFilter, setHackathonFilter] = useState<string>("ALL");
  const [judgeFilter, setJudgeFilter] = useState<string>("ALL");

  // Tri
  const [sortBy, setSortBy] = useState<SortableColumn>("evaluated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // États de chargement
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Réinitialiser à la page 1 lorsque les filtres, la recherche ou la limite changent
  useEffect(() => {
    setPage(1);
  }, [search, hackathonFilter, judgeFilter, limit]);

  // Basculer la colonne et le sens du tri
  const toggleSort = useCallback((column: SortableColumn) => {
    setSortBy((prevSortBy) => {
      if (prevSortBy === column) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        return column;
      }
      setSortOrder("desc");
      return column;
    });
  }, []);

  // Fonction de récupération des données (à adapter selon votre client API / Supabase)
  const fetchEvaluations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy,
        sortOrder,
      });

      if (search.trim()) params.append("search", search.trim());
      if (hackathonFilter !== "ALL") params.append("hackathonId", hackathonFilter);
      if (judgeFilter !== "ALL") params.append("judgeId", judgeFilter);

      /* =================================================================
       * EXEMPLE DE CONNEXION API / REST :
       * =================================================================
       * const response = await fetch(`/api/evaluations?${params.toString()}`);
       * if (!response.ok) throw new Error("Erreur lors du chargement des évaluations.");
       * const data = await response.json();
       * setEvaluations(data.data);
       * setTotal(data.total);
       */

      // Simulation de chargement asynchrone (à remplacer par votre appel d'API)
      await new Promise((resolve) => setTimeout(resolve, 350));

      // Données de démonstration
      const mockData: Evaluation[] = [
        {
          id: "eval-1",
          submission_title: "AI Eco Tracker",
          demo_url: "https://demo.example.com/eco",
          team_name: "GreenTech",
          hackathon_title: "Hackathon Climat 2026",
          judge_name: "Amina Benali",
          judge_username: "amina_b",
          score: 88,
          evaluated_at: new Date().toISOString(),
        },
        {
          id: "eval-2",
          submission_title: "Smart Health Dashboard",
          demo_url: "https://health.example.com",
          author_name: "Karim Mansouri",
          hackathon_title: "MedTech Innovation",
          judge_name: "Thomas Dupont",
          judge_username: "tdupont",
          score: 94,
          evaluated_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      setEvaluations(mockData);
      setTotal(mockData.length);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Une erreur inconnue est survenue.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, hackathonFilter, judgeFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    evaluations,
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
    judgeFilter,
    setJudgeFilter,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch: fetchEvaluations,
  };
}