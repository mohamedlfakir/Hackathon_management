// src/hooks/useTeams.ts
import { useState, useEffect, useCallback } from "react";
import * as teamsService from "../services/team.service";
import type { Team } from "../api/team.api";

interface UseTeamsOptions {
  pageSize?: number;
}

export function useTeams({ pageSize = 10 }: UseTeamsOptions = {}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSize);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "hackathon_title" | "created_at">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction centrale de requêtage
  const fetchTeams = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamsService.getAllTeams({
        page,
        limit,
        search: searchQuery,
        sortBy,
        sortOrder,
      });
      
      // Adaptation selon la structure exacte de votre réponse API
      setTeams(response.teams || []);
      setTotal(response.total || 0);
      setTotalPages(response.total_pages || 1);
      console.log("Fetched teams:", response.teams); // Log the fetched teams for debugging
    } catch (err: any) {
      setError(
        err?.response?.data?.message || 
        err?.message || 
        "Une erreur est survenue lors de la récupération des équipes."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, sortOrder]);

  // Effet gérant le debounce de la recherche (300ms d'attente après la frappe)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchTeams(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search, fetchTeams]);

  // Réinitialise la page courante à 1 dès que l'utilisateur filtre ou trie
  useEffect(() => {
    setPage(1);
  }, [search, sortBy, sortOrder]);

  // Déclencheur manuel (utilisé après une suppression ou mise à jour)
  const refetch = useCallback(() => {
    fetchTeams(search);
  }, [fetchTeams, search]);

  // Gestion de l'inversion ou du changement de colonne de tri
  const toggleSort = useCallback((column: "name" | "hackathon_title" | "created_at") => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }, [sortBy]);

  return {
    teams,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch,
  };
}