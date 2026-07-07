// src/components/admin/hackathons/tabs/ParticipantsTab.tsx
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { adminColors, adminFonts } from "../../../theme/adminTokens";
import * as hackathonsService from "../../../services/hackathon.service";

// NOTE: the shape of a "participant" record isn't defined by the API you
// shared — getParticipants just returns `response.participants`. This reads
// defensively: it uses `.user` if the entry wraps one (a registration row),
// otherwise treats the entry itself as the user. Adjust once you confirm
// the real shape.
interface ParticipantLike {
  id?: number;
  registered_at?: string;
  created_at?: string;
  user?: {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  username?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

function personOf(p: ParticipantLike) {
  return p.user ?? p;
}

export default function ParticipantsTab({ hackathonId }: { hackathonId: number }) {
  const [participants, setParticipants] = useState<ParticipantLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hackathonsService.getHackathonParticipants(hackathonId);
      setParticipants(data ?? []);
    } catch (err) {
      setError("Impossible de charger les participants.");
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return (
    <div style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }} className="rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${adminColors.border}` }}>
        <span style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 14 }}>
          {participants.length} participant{participants.length > 1 ? "s" : ""}
        </span>
        {/* Registration is self-service: POST /hackathons/:id/register takes no
            user id, so a participant joins from their own hackathon page.
            Admins/managers can view the roster here but there's no "add
            someone else" action to wire up unless the API adds one. */}
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
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
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