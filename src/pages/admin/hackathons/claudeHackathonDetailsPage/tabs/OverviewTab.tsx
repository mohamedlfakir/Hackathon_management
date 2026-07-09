// src/components/admin/hackathons/tabs/OverviewTab.tsx
import type { ReactNode } from "react";
import { FileText, ShieldCheck } from "lucide-react";
import { adminColors, adminFonts } from "../../../../../theme/adminTokens";
import type { Hackathon } from "../../../../../api/hackathon.api";

export default function OverviewTab({ hackathon }: { hackathon: Hackathon }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card icon={<FileText size={15} />} title="Règlement">
        {hackathon.rules ? (
          <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5, whiteSpace: "pre-wrap" }}>
            {hackathon.rules}
          </p>
        ) : (
          <p style={{ fontFamily: adminFonts.body, color: adminColors.faint, fontSize: 13 }}>Aucun règlement renseigné.</p>
        )}
      </Card>

      <Card icon={<ShieldCheck size={15} />} title="Métadonnées">
        <div className="flex flex-col gap-2">
          <Row label="ID">{hackathon.id}</Row>
          <Row label="Créé par">Utilisateur #{hackathon.created_by}</Row>
          <Row label="Créé le">{new Date(hackathon.created_at).toLocaleString("fr-FR")}</Row>
          <Row label="Mis à jour le">{new Date(hackathon.updated_at).toLocaleString("fr-FR")}</Row>
        </div>
      </Card>
    </div>
  );
}

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div
      style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
      className="rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center gap-2" style={{ color: adminColors.text }}>
        {icon}
        <span style={{ fontFamily: adminFonts.heading, fontWeight: 700, fontSize: 14 }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ fontFamily: adminFonts.body, color: adminColors.faint, fontSize: 12.5 }}>{label}</span>
      <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 12.5, fontWeight: 600 }}>{children}</span>
    </div>
  );
}
