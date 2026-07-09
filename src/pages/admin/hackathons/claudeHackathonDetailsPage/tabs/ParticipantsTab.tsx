// src/components/admin/hackathons/tabs/ParticipantsTab.tsx
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { UserPlus, X } from "lucide-react";
import { adminColors, adminFonts } from "../../../../../theme/adminTokens";
import * as hackathonsService from "../../../../../services/hackathon.service";
import * as usersService from "../../../../../services/user.service";
import type { User } from "../../../../../api/user.api";

// NOTE: the shape of a "participant" record isn't defined by the API you
// shared — getParticipants just returns `response.participants`. This reads
// defensively: it uses `.user` if the entry wraps one (a registration row),
// otherwise treats the entry itself as the user. Adjust once you confirm
// the real shape.
interface ParticipantLike {
  id?: number;
  registered_at?: string;
  created_at?: string;
  user?: User;
  [key: string]: unknown;
}

function personOf(p: ParticipantLike): Partial<User> {
  return p.user ?? (p as unknown as User);
}

export default function ParticipantsTab({ hackathonId }: { hackathonId: number }) {
  const [participants, setParticipants] = useState<ParticipantLike[]>([]);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [registered, everyParticipant] = await Promise.all([
        hackathonsService.getHackathonParticipants(hackathonId),
        usersService.getAllUsers({ role: "PARTICIPANT", limit: 100 }),
      ]);
      setParticipants(registered ?? []);
      setAvailableUsers(everyParticipant.users ?? []);
    } catch (err) {
      setError("Impossible de charger les participants.");
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const registeredIds = useMemo(
    () => new Set(participants.map((p) => personOf(p).id).filter((id): id is number => id !== undefined)),
    [participants]
  );
  const selectableUsers = availableUsers.filter((u) => !registeredIds.has(u.id));

  async function handleRegister() {
    if (!selectedUserId) return;
    setRegistering(true);
    try {
      await hackathonsService.assignUserByAdmin(hackathonId, Number(selectedUserId));
      setSelectedUserId("");
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering(false);
    }
  }

  async function handleRemove(userId: number) {
    setRemovingId(userId);
    try {
      await hackathonsService.assignUserByAdmin(hackathonId, userId);
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
          Inscrire un participant
        </span>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : "")}
          style={{
            fontFamily: adminFonts.body,
            color: adminColors.text,
            border: `1px solid ${adminColors.border}`,
            background: adminColors.bg,
          }}
          className="rounded-md px-3 py-2 text-sm outline-none flex-1 min-w-[200px]"
        >
          <option value="">Sélectionner un utilisateur…</option>
          {selectableUsers.map((u) => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name} ({u.email})
            </option>
          ))}
        </select>
        <button
          onClick={handleRegister}
          disabled={!selectedUserId || registering}
          style={{
            fontFamily: adminFonts.body,
            color: "#fff",
            background: adminColors.accent,
            fontSize: 13,
            opacity: !selectedUserId || registering ? 0.6 : 1,
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
            {participants.length} participant{participants.length > 1 ? "s" : ""}
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
        {!loading && !error && participants.length === 0 && (
          <div className="px-4 py-10 text-center" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }}>
            Aucun participant inscrit pour le moment.
          </div>
        )}
        {!loading && !error && participants.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                <Th>Participant</Th>
                <Th>Email</Th>
                <Th>Inscrit le</Th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => {
                const person = personOf(p);
                const when = p.registered_at ?? p.created_at;
                return (
                  <tr key={person.id ?? i} style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                    <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5 }}>
                      {person.first_name || person.last_name
                        ? `${person.first_name ?? ""} ${person.last_name ?? ""}`.trim()
                        : person.username ?? "—"}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                      {person.email ?? "—"}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                      {when ? new Date(when).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => person.id !== undefined && handleRemove(person.id)}
                        disabled={removingId === person.id}
                        style={{ color: adminColors.danger }}
                        className="p-1.5 rounded-md hover:opacity-70"
                        aria-label="Désinscrire"
                      >
                        <X size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-4 py-3 text-left" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>
      {children}
    </th>
  );
}
