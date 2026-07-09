import { adminFonts } from "../../../theme/adminTokens";
import { type HackathonStatus } from "../../../hooks/useHackathons";

interface StatusBadgeProps {
  status: HackathonStatus;
}

const STATUS_CONFIG: Record<HackathonStatus, { label: string; bg: string; text: string }> = {
  OPEN: { label: "Ouvert", bg: "#eff6ff", text: "#2563eb" },
  FINISHED: { label: "Terminé", bg: "#faf5ff", text: "#7c3aed" },
  CLOSED: { label: "Fermé", bg: "#fef2f2", text: "#dc2626" },
  UPCOMING: { label: "À venir", bg: "#f0fdf4", text: "#16a34a" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, bg: "#f8fafc", text: "#64748b" };

  return (
    <span
      style={{
        fontFamily: adminFonts.body,
        backgroundColor: config.bg,
        color: config.text,
      }}
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border border-transparent whitespace-nowrap select-none"
    >
      {config.label}
    </span>
  );
}