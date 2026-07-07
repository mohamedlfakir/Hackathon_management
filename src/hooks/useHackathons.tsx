import { useState, useEffect, useCallback } from "react";
import * as hackathonsService from "../services/hackathon.service";
import type { Hackathon } from "../api/hackathon.api";

export type HackathonSortBy = "start_date" | "title" | "registration_deadline" | "status";

interface UseHackathonsOptions {
  pageSize?: number;
}

export type HackathonStatus = "OPEN" | "CLOSED" | "FINISHED" | "UPCOMING";

export function useHackathons({ pageSize = 9 }: UseHackathonsOptions = {}) {
  // 1. États des filtres, tris et pagination
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<HackathonSortBy>("start_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // 2. États des données issues de l'API
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction principale de récupération
  const fetchHackathons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Les paramètres sont envoyés ici sous forme d'objet.
      // JavaScript permet de passer des arguments même si getAllHackathons() ne les attend pas encore.
      const data = await hackathonsService.getAllHackathons({
        page,
        search,
        status: statusFilter,
        sortBy,
        sortOrder,
        pageSize,
      });

      // Gestion transitoire : s'adapte à votre API actuelle (tableau plat) 
      // tout en anticipant une future réponse paginée type { hackathons: [...], total: 30 }
      if (Array.isArray(data)) {
        setHackathons(data);
        setTotal(data.length);
        setTotalPages(Math.ceil(data.length / pageSize) || 1);
      } else if (data && typeof data === "object") {
        const list = data.hackathons || [];
        const totalCount = data.total !== undefined ? data.total : list.length;
        setHackathons(list);
        setTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / pageSize) || 1);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des hackathons :", err);
      setError("Impossible de charger la liste des hackathons. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, sortBy, sortOrder, pageSize]);

  // Déclenche une nouvelle requête dès qu'un paramètre de filtre ou de pagination change
  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  // Force le retour à la page 1 si l'utilisateur change la recherche ou le filtre de statut
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // Commutateur d'ordre de tri (A-Z / Z-A)
  const toggleSort = useCallback((field: HackathonSortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }, [sortBy]);

  return {
    hackathons,
    total,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch: fetchHackathons,
  };
}