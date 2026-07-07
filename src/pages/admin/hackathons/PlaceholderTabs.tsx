// src/components/admin/hackathons/tabs/PlaceholderTabs.tsx
import type { ReactNode } from "react";
import { FolderKanban, Users as UsersIcon } from "lucide-react";
import { adminColors, adminFonts } from "../../../theme/adminTokens";

// Teams and Submissions aren't wired to a real API yet — share team.api.ts /
// submission.api.ts (same pattern as hackathon.api.ts + hackathon.service.ts)
// and these can be built out exactly like ParticipantsTab / JudgesTab.

function Placeholder({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div
      style={{ background: adminColors.surface, border: `1px dashed ${adminColors.borderStrong}` }}
      className="rounded-xl p-10 flex flex-col items-center text-center gap-2"
    >
      <div style={{ color: adminColors.faint }}>{icon}</div>
      <span style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 14 }}>{title}</span>
      <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }} className="max-w-sm">
        {description}
      </p>
    </div>
  );
}

export function TeamsTab({ hackathonId }: { hackathonId: number }) {
  return (
    <Placeholder
      icon={<UsersIcon size={22} />}
      title="Équipes"
      description={`Prêt à brancher dès que team.api.ts sera partagé (équipes du hackathon #${hackathonId}).`}
    />
  );
}

export function SubmissionsTab({ hackathonId }: { hackathonId: number }) {
  return (
    <Placeholder
      icon={<FolderKanban size={22} />}
      title="Soumissions"
      description={`Prêt à brancher dès que submission.api.ts sera partagé (soumissions du hackathon #${hackathonId}).`}
    />
  );
}