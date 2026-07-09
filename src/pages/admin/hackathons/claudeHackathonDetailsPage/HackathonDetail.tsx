// src/pages/admin/HackathonDetail.tsx
import { useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2, Calendar, MapPin, Users as UsersIcon, Clock } from "lucide-react";
import { adminColors, adminFonts } from "../../../../theme/adminTokens";
import { useHackathon } from "./useHackathon";
import * as hackathonsService from "../../../../services/hackathon.service";
import StatusBadge, { HACKATHON_STATUS_OPTIONS } from "./StatusBadge";
import HackathonFormModal, { type HackathonFormValues } from "./HackathonFormModal";
import ConfirmDialog from "../../users/ConfirmDialog";
import OverviewTab from "./tabs/OverviewTab";
import ParticipantsTab from "./tabs/ParticipantsTab";
import TeamsTab from "./tabs/TeamsTab";
import SubmissionsTab from "./tabs/SubmissionsTab";
import JudgesTab from "./tabs/JudgesTab";

const TABS = [
  { key: "overview", label: "Aperçu" },
  { key: "participants", label: "Participants" },
  { key: "teams", label: "Équipes" },
  { key: "submissions", label: "Soumissions" },
  { key: "judges", label: "Juges" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function HackathonDetail() {
  const { id } = useParams<{ id: string }>();
  const hackathonId = Number(id);
  const navigate = useNavigate();
  const { hackathon, loading, error, update } = useHackathon(hackathonId);

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [editOpen, setEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

type HackathonStatus = "OPEN" | "CLOSED" | "FINISHED" | "UPCOMING";

  async function handleUpdate(values: HackathonFormValues) {
    setSubmitting(true);
    try {
      await update({
        title: values.title,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        registration_deadline: values.registration_deadline,
        max_team_size: values.max_team_size,
        rules: values.rules,
        location: values.location,
        is_online: values.is_online,
        status: values.status as HackathonStatus,
      });
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuickStatusChange(status: string) {
    if (!hackathon || status === hackathon.status) return;
    setStatusUpdating(true);
    try {
      await update({ status: status as HackathonStatus });
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleDelete() {
    if (!hackathon) return;
    setDeleting(true);
    try {
      await hackathonsService.deleteHackathon(hackathon.id);
      navigate("/admin/hackathons");
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="rounded-xl h-48 animate-pulse"
      />
    );
  }

  if (error || !hackathon) {
    return (
      <div style={{ fontFamily: adminFonts.body, color: adminColors.danger, fontSize: 13.5 }} className="text-center py-10">
        {error ?? "Hackathon introuvable."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => navigate(-1)}
        style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}
        className="flex items-center gap-1.5 hover:opacity-70 w-fit"
      >
        <ArrowLeft size={15} /> Retour
      </button>

      {/* header card */}
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="rounded-xl p-5 flex flex-col gap-4"
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 20 }}>
              {hackathon.title}
            </h1>
            <StatusBadge status={hackathon.status} />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={hackathon.status}
              disabled={statusUpdating}
              onChange={(e) => handleQuickStatusChange(e.target.value)}
              style={{
                fontFamily: adminFonts.body,
                color: adminColors.text,
                border: `1px solid ${adminColors.border}`,
                background: adminColors.bg,
                fontSize: 13,
              }}
              className="rounded-md px-3 py-2 outline-none"
              aria-label="Changer le statut"
            >
              {HACKATHON_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              onClick={() => setEditOpen(true)}
              style={{ fontFamily: adminFonts.body, color: adminColors.text, border: `1px solid ${adminColors.border}`, fontSize: 13 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md hover:opacity-70"
            >
              <Pencil size={14} /> Modifier
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              style={{ fontFamily: adminFonts.body, color: adminColors.danger, border: `1px solid ${adminColors.border}`, fontSize: 13 }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-md hover:opacity-70"
            >
              <Trash2 size={14} /> Supprimer
            </button>
          </div>
        </div>

        <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }}>{hackathon.description}</p>

        <div className="flex items-center gap-5 flex-wrap">
          <InfoItem icon={<Calendar size={14} />}>
            {new Date(hackathon.start_date).toLocaleDateString("fr-FR")} →{" "}
            {new Date(hackathon.end_date).toLocaleDateString("fr-FR")}
          </InfoItem>
          <InfoItem icon={<Clock size={14} />}>
            Inscriptions jusqu'au {new Date(hackathon.registration_deadline).toLocaleDateString("fr-FR")}
          </InfoItem>
          <InfoItem icon={<MapPin size={14} />}>
            {hackathon.is_online ? "En ligne" : hackathon.location || "Lieu à définir"}
          </InfoItem>
          <InfoItem icon={<UsersIcon size={14} />}>Équipes de {hackathon.max_team_size} max.</InfoItem>
        </div>
      </div>

      {/* tabs */}
      <div className="flex items-center gap-1 flex-wrap" style={{ borderBottom: `1px solid ${adminColors.border}` }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              fontFamily: adminFonts.body,
              color: activeTab === t.key ? adminColors.accentText : adminColors.muted,
              fontSize: 13.5,
              fontWeight: activeTab === t.key ? 600 : 500,
              borderBottom: activeTab === t.key ? `2px solid ${adminColors.accent}` : "2px solid transparent",
            }}
            className="px-4 py-2.5 -mb-px hover:opacity-80"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "overview" && <OverviewTab hackathon={hackathon} />}
        {activeTab === "participants" && <ParticipantsTab hackathonId={hackathon.id} />}
        {activeTab === "teams" && <TeamsTab hackathonId={hackathon.id} />}
        {activeTab === "submissions" && <SubmissionsTab hackathonId={hackathon.id} />}
        {activeTab === "judges" && <JudgesTab hackathonId={hackathon.id} />}
      </div>

      <HackathonFormModal
        open={editOpen}
        mode="edit"
        initialHackathon={hackathon}
        submitting={submitting}
        onClose={() => setEditOpen(false)}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Supprimer ce hackathon ?"
        description={`"${hackathon.title}" sera définitivement supprimé, avec toutes ses données associées. Cette action est irréversible.`}
        confirmLabel="Supprimer"
        danger
        submitting={deleting}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function InfoItem({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-1.5" style={{ color: adminColors.muted }}>
      {icon}
      <span style={{ fontFamily: adminFonts.body, fontSize: 12.5 }}>{children}</span>
    </div>
  );
}
