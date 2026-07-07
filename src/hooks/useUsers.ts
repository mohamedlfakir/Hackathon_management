// src/hooks/useUsers.ts
import { useCallback, useEffect, useState } from "react";
import * as usersService from "../services/user.service";
import type { User, GetUsersParams } from "../api/user.api";

type SortBy = "username" | "email" | "role" | "created_at";
type SortOrder = "asc" | "desc";

interface UseUsersOptions {
  pageSize?: number;
}

// Owns every piece of state the Users page needs (search, role filter, sort,
// pagination) and refetches whenever one of them changes. `params` is passed
// straight through to the service/API, so wiring real backend pagination
// later is just a matter of the API honoring these fields.
export function useUsers({ pageSize = 10 }: UseUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(pageSize);

  // `search` is bound to the input for instant typing feedback; the actual
  // request uses `debouncedSearch`, updated 300ms after typing stops.
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<User["role"] | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortBy>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: GetUsersParams = {
        page,
        limit,
        search: debouncedSearch || undefined,
        role: roleFilter === "ALL" ? undefined : roleFilter,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
      const response = await usersService.getAllUsers(params);
      setUsers(response.users);
      setTotal(response.total);
    } catch (err) {
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Any search/filter/sort change should jump back to page 1.
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, roleFilter, sortBy, sortOrder]);

  function toggleSort(column: SortBy) {
    if (sortBy === column) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    users,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch: fetchUsers,
  };
}