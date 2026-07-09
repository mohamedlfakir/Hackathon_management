// src/components/admin/hackathons/StatusBadge.tsx
import { adminColors, adminFonts } from "../../../../theme/adminTokens";

// `status` is a plain string on the API, not a strict union, so this maps
// the statuses we expect and falls back to showing whatever string comes
// back for anything else.
const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: adminColors.surfaceHover, text: adminColors.muted, label: "Brouillon" },
  PUBLISHED: { bg: adminColors.infoSoft, text: adminColors.info, label: "Publié" },
  ONGOING: { bg: adminColors.warningSoft, text: adminColors.warning, label: "En cours" },
  COMPLETED: { bg: adminColors.successSoft, text: adminColors.success, label: "Terminé" },
  CANCELLED: { bg: adminColors.dangerSoft, text: adminColors.danger, label: "Annulé" },
};

export const HACKATHON_STATUS_OPTIONS = ["DRAFT", "PUBLISHED", "ONGOING", "COMPLETED", "CANCELLED"];

export default function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: adminColors.surfaceHover, text: adminColors.muted, label: status };
  return (
    <span
      style={{ background: s.bg, color: s.text, fontFamily: adminFonts.body, fontSize: 12, fontWeight: 600 }}
      className="px-2.5 py-1 rounded-full inline-block whitespace-nowrap"
    >
      {s.label}
    </span>
  );
}
