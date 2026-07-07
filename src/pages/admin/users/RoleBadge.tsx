// src/components/admin/users/RoleBadge.tsx
import { adminColors, adminFonts } from "../../../theme/adminTokens";
import type { User } from "../../../api/user.api";

const ROLE_STYLES: Record<User["role"], { bg: string; text: string; label: string }> = {
  ADMIN: { bg: adminColors.dangerSoft, text: adminColors.danger, label: "Admin" },
  ORGANIZER: { bg: adminColors.infoSoft, text: adminColors.info, label: "Organisateur" },
  JUDGE: { bg: adminColors.warningSoft, text: adminColors.warning, label: "Juré" },
  PARTICIPANT: { bg: adminColors.successSoft, text: adminColors.success, label: "Participant" },
};

export default function RoleBadge({ role }: { role: User["role"] }) {
  const s = ROLE_STYLES[role];
  return (
    <span
      style={{ background: s.bg, color: s.text, fontFamily: adminFonts.body, fontSize: 12, fontWeight: 600 }}
      className="px-2.5 py-1 rounded-full inline-block"
    >
      {s.label}
    </span>
  );
}