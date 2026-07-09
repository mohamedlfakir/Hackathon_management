// src/components/admin/hackathons/tabs/SubmissionsTab.tsx
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { adminColors, adminFonts } from "../../../../../theme/adminTokens";
import * as hackathonsService from "../../../../../services/hackathon.service";

// NOTE: submission.api.ts wasn't shared, so this reads defensively — it only
// requires an `id`, and optionally shows a title / team name / status / date
// if present. Adjust field names once submission.api.ts exists, and adjust
// the destination route if submissions live somewhere other than
// /admin/submissions/:id.
interface SubmissionLike {
  id: number;
  title?: string;
  team?: { id: number; name?: string };
  team_name?: string;
  status?: string;
  submitted_at?: string;
  created_at?: string;
  [key: string]: unknown;
}

export default function SubmissionsTab({ hackathonId }: { hackathonId: number }) {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<SubmissionLike[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await hackathonsService.getHackathonSubmissions(hackathonId);
      setSubmissions(data ?? []);
    } catch (err) {
      setError("Impossible de charger les soumissions.");
    } finally {
      setLoading(false);
    }
  }, [hackathonId]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }} className="rounded-xl overflow-hidden">
      <div className="px-4 py-3" style={{ borderBottom: `1px solid ${adminColors.border}` }}>
        <span style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 14 }}>
          {submissions.length} soumission{submissions.length > 1 ? "s" : ""}
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
      {!loading && !error && submissions.length === 0 && (
        <div className="px-4 py-10 text-center" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }}>
          Aucune soumission pour le moment.
        </div>
      )}
      {!loading &&
        !error &&
        submissions.map((s) => {
          const when = s.submitted_at ?? s.created_at;
          return (
            <button
              key={s.id}
              onClick={() => navigate(`/admin/submissions/${s.id}`)}
              className="w-full flex items-center justify-between px-4 py-3 hover:opacity-80 text-left"
              style={{ borderBottom: `1px solid ${adminColors.border}` }}
            >
              <div>
                <div style={{ fontFamily: adminFonts.body, color: adminColors.text, fontWeight: 600, fontSize: 13.5 }}>
                  {s.title ?? `Soumission #${s.id}`}
                </div>
                <div style={{ fontFamily: adminFonts.body, color: adminColors.faint, fontSize: 12 }}>
                  {s.team?.name ?? s.team_name ?? "Équipe inconnue"}
                  {when ? ` · ${new Date(when).toLocaleDateString("fr-FR")}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {s.status && (
                  <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12 }}>{s.status}</span>
                )}
                <ChevronRight size={15} color={adminColors.faint} />
              </div>
            </button>
          );
        })}
    </div>
  );
}
