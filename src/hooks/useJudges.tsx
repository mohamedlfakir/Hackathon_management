import { useState, useEffect, useCallback } from "react";
// Remplacez le chemin d'import par l'emplacement réel de votre userService
import { getAllUsers } from "../services/user.service";

export interface Judge {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  role?: string;
  [key: string]: any;
}

interface UseJudgesOptions {
  /** Active ou désactive le chargement automatique au montage */
  autoFetch?: boolean;
}

export function useJudges({ autoFetch = true }: UseJudgesOptions = {}) {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJudges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Appel du service de gestion des utilisateurs avec le rôle 'judge'
      const response = await getAllUsers({ role: "JUDGE" });

      // Extraction sécurisée du tableau d'utilisateurs
      const rawUsers = Array.isArray(response)
        ? response
        : response?.users || [];

      // Mapping pour garantir le type Judge[]
      const data: Judge[] = (rawUsers as any[]).map((user) => ({
        ...user,
        id: String(user.id), // Convertit l'ID en string si nécessaire pour la cohérence
      }));

      setJudges(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des juges.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchJudges();
    }
  }, [autoFetch, fetchJudges]);

  return {
    judges,
    loading,
    error,
    refetch: fetchJudges,
  };
}