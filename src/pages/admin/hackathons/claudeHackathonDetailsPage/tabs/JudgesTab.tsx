// src/components/admin/hackathons/tabs/JudgesTab.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { UserPlus, X } from "lucide-react";
import { adminColors, adminFonts } from "../../../../../theme/adminTokens";
import * as hackathonsService from "../../../../../services/hackathon.service";
import * as usersService from "../../../../../services/user.service";
import type { User } from "../../../../../api/user.api";

// NOTE: getHackathonJudges's exact return shape isn't specified either — this
// assumes each entry is either a User directly or wraps one as `.judge` /
// `.user`. Adjust `judgeOf` once you confirm the real shape.
interface JudgeEntryLike {
  id?: number;
  judge?: User;
  user?: User;
  [key: string]: unknown;
}

function judgeOf(entry: JudgeEntryLike): Partial<User> {
  return entry.judge ?? entry.user ?? (entry as unknown as User);
}

export default function JudgesTab({ hackathonId }: { hackathonId: number }) {
  const [judges, setJudges] = useState<JudgeEntryLike[]>([]);
  const [availableJudges, setAvailableJudges] = useState<User[]>([]);
  const [selectedJudgeId, setSelectedJudgeId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [assigned, allJudges] = await Promise.all([
        hackathonsService.getHackathonJudges(hackathonId),
        usersService.getAllUsers({ role: "JUDGE", limit: 100 }),
      ]);
      setJudges(assigned ?? []);
      setAvailableJudges(allJudges.users ?? []);
    } catch (err) {
      setError("Impossible de charger les juges.");
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const assignedIds = useMemo(
    () => new Set(judges.map((j) => judgeOf(j).id).filter((id): id is number => id !== undefined)),
    [judges]
  );
  const selectableJudges = availableJudges.filter((u) => !assignedIds.has(u.id));

  async function handleAssign() {
    if (!selectedJudgeId) return;
    setAssigning(true);
    try {
      await hackathonsService.assignJudge(hackathonId, Number(selectedJudgeId));
      setSelectedJudgeId("");
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setAssigning(false);
    }
  }

  async function handleRemove(judgeId: number) {
    setRemovingId(judgeId);
    try {
      await hackathonsService.removeJudge(hackathonId, judgeId);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* assign form */}
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="rounded-xl p-4 flex items-center gap-3 flex-wrap"
      >
        <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5, fontWeight: 600 }}>
          Assigner un juge
        </span>
        <select
          value={selectedJudgeId}
          onChange={(e) => setSelectedJudgeId(e.target.value ? Number(e.target.value) : "")}
          style={{
            fontFamily: adminFonts.body,
            color: adminColors.text,
            border: `1px solid ${adminColors.border}`,
            background: adminColors.bg,
          }}
          className="rounded-md px-3 py-2 text-sm outline-none flex-1 min-w-[200px]"
        >
          <option value="">Sélectionner un juge…</option>
          {selectableJudges.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name} ({u.email})
            </option>
          ))}
        </select>
        <button
          onClick={handleAssign}
          disabled={!selectedJudgeId || assigning}
          style={{
            fontFamily: adminFonts.body,
            color: "#fff",
            background: adminColors.accent,
            fontSize: 13,
            opacity: !selectedJudgeId || assigning ? 0.6 : 1,
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md font-medium hover:opacity-90"
        >
          <UserPlus size={15} /> Assigner
        </button>
      </div>

      {/* assigned list */}
      <div style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }} className="rounded-xl overflow-hidden">
        <div className="px-4 py-3" style={{ borderBottom: `1px solid ${adminColors.border}` }}>
          <span style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 14 }}>
            {judges.length} juge{judges.length > 1 ? "s" : ""} assigné{judges.length > 1 ? "s" : ""}
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
        {!loading && !error && judges.length === 0 && (
          <div className="px-4 py-10 text-center" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }}>
            Aucun juge assigné pour ce hackathon.
          </div>
        )}
        {!loading &&
          !error &&
          judges.map((j, i) => {
            const person = judgeOf(j);
            return (
              <div
                key={person.id ?? i}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: `1px solid ${adminColors.border}` }}
              >
                <div>
                  <div style={{ fontFamily: adminFonts.body, color: adminColors.text, fontWeight: 600, fontSize: 13.5 }}>
                    {person.first_name} {person.last_name}
                  </div>
                  <div style={{ fontFamily: adminFonts.body, color: adminColors.faint, fontSize: 12 }}>{person.email}</div>
                </div>
                <button
                  onClick={() => person.id !== undefined && handleRemove(person.id)}
                  disabled={removingId === person.id}
                  style={{ color: adminColors.danger }}
                  className="p-1.5 rounded-md hover:opacity-70"
                  aria-label="Retirer"
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
