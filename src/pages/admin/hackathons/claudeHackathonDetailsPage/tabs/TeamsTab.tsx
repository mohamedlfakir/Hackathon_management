// src/components/admin/hackathons/tabs/TeamsTab.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserPlus, X } from "lucide-react";
import { adminColors, adminFonts } from "../../../../../theme/adminTokens";
import * as hackathonsService from "../../../../../services/hackathon.service";
import * as teamsService from "../../../../../services/team.service";
import type { Team } from "../../../../../api/team.api";

// NOTE: getHackathonTeams's exact return shape isn't defined (team.api.ts is
// a stub — see api/team.api.ts). This assumes each entry is either a Team
// directly or wraps one as `.team`.
interface TeamEntryLike {
  id?: number;
  team?: Team;
  [key: string]: unknown;
}

function teamOf(entry: TeamEntryLike): Partial<Team> {
  return entry.team ?? (entry as unknown as Team);
}

export default function TeamsTab({ hackathonId }: { hackathonId: number }) {
  const [teams, setTeams] = useState<TeamEntryLike[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [registered, everyTeam] = await Promise.all([
        hackathonsService.getHackathonTeams(hackathonId),
        teamsService.getAllTeams({ page: 1, limit: 100, search: "", sortBy: "name", sortOrder: "asc" }),
      ]);
      setTeams(registered ?? []);
      setAllTeams(everyTeam ?? []);
    } catch (err) {
      setError("Impossible de charger les équipes.");
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const registeredIds = useMemo(
    () => new Set(teams.map((t) => teamOf(t).id).filter((id): id is number => id !== undefined)),
    [teams]
  );
  const selectableTeams = allTeams.filter((t) => !registeredIds.has(t.id));

  async function handleRegister() {
    if (!selectedTeamId) return;
    setRegistering(true);
    try {
      await hackathonsService.registerTeam(hackathonId, Number(selectedTeamId));
      setSelectedTeamId("");
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  }

  async function handleRemove(teamId: number) {
    setRemovingId(teamId);
    try {
      await hackathonsService.unregisterTeam(hackathonId, teamId);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* register form */}
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="rounded-xl p-4 flex items-center gap-3 flex-wrap"
      >
        <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5, fontWeight: 600 }}>
          Inscrire une équipe
        </span>
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value ? Number(e.target.value) : "")}
          style={{
            fontFamily: adminFonts.body,
            color: adminColors.text,
            border: `1px solid ${adminColors.border}`,
            background: adminColors.bg,
          }}
          className="rounded-md px-3 py-2 text-sm outline-none flex-1 min-w-[200px]"
        >
          <option value="">Sélectionner une équipe…</option>
          {selectableTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleRegister}
          disabled={!selectedTeamId || registering}
          style={{
            fontFamily: adminFonts.body,
            color: "#fff",
            background: adminColors.accent,
            fontSize: 13,
            opacity: !selectedTeamId || registering ? 0.6 : 1,
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md font-medium hover:opacity-90"
        >
          <UserPlus size={15} /> Inscrire
        </button>
      </div>

      {/* registered list */}
      <div style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }} className="rounded-xl overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${adminColors.border}` }}>
          <span style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 14 }}>
            {teams.length} équipe{teams.length > 1 ? "s" : ""} inscrite{teams.length > 1 ? "s" : ""}
          </span>
        </div>

        {loading && (
          <div className="p-4">
            <div style={{ background: adminColors.surfaceHover }} className="h-4 rounded animate-pulse" />
          </div>
        )}
        {!loading && error && (
          <div className="px-4 py-10 text-center" style={{ fontFamily: adminFonts.body, color: adminColors.danger, fontSize: 13.5 }}>
            {error}
          </div>
        )}
        {!loading && !error && teams.length === 0 && (
          <div className="px-4 py-10 text-center" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }}>
            Aucune équipe inscrite pour ce hackathon.
          </div>
        )}
        {!loading &&
          !error &&
          teams.map((t, i) => {
            const team = teamOf(t);
            return (
              <div
                key={team.id ?? i}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: `1px solid ${adminColors.border}` }}
              >
                <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontWeight: 600, fontSize: 13.5 }}>
                  {team.name ?? `Équipe #${team.id}`}
                </span>
                <button
                  onClick={() => team.id !== undefined && handleRemove(team.id)}
                  disabled={removingId === team.id}
                  style={{ color: adminColors.danger }}
                  className="p-1.5 rounded-md hover:opacity-70"
                  aria-label="Désinscrire"
                >
                  <X size={15} />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
