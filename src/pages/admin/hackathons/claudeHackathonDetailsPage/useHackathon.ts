// src/hooks/useHackathon.ts
import { useCallback, useEffect, useState } from "react";
import * as hackathonsService from "../../../../services/hackathon.service";
import type { Hackathon, UpdateHackathonRequest } from "../../../../api/hackathon.api";

export function useHackathon(id: number) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOne = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hackathonsService.getHackathonById(id);
      setHackathon(data);
    } catch (err) {
      setError("Impossible de charger ce hackathon.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOne();
  }, [fetchOne]);

  async function update(payload: UpdateHackathonRequest) {
    const updated = await hackathonsService.updateHackathon(id, payload);
    setHackathon(updated);
    return updated;
  }

  return { hackathon, loading, error, refetch: fetchOne, update };
}
