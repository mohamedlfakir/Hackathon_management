// src/components/admin/hackathons/HackathonFormModal.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { adminColors, adminFonts } from "../../../../theme/adminTokens";
import { HACKATHON_STATUS_OPTIONS } from "./StatusBadge";
import type { Hackathon } from "../../../../api/hackathon.api";

export interface HackathonFormValues {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  location: string;
  is_online: boolean;
  max_team_size: number;
  rules: string;
  status: string;
}

const EMPTY_VALUES: HackathonFormValues = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  registration_deadline: "",
  location: "",
  is_online: false,
  max_team_size: 4,
  rules: "",
  status: "DRAFT",
};

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm"; the API returns
// full ISO strings, so trim when prefilling from an existing hackathon.
function toInputValue(iso?: string) {
  return iso ? iso.slice(0, 16) : "";
}

export default function HackathonFormModal({
  open,
  mode,
  initialHackathon,
  submitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initialHackathon?: Hackathon | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: HackathonFormValues) => void;
}) {
  const [values, setValues] = useState<HackathonFormValues>(EMPTY_VALUES);

  useEffect(() => {
    if (!open) return;
    setValues(
      initialHackathon
        ? {
            title: initialHackathon.title,
            description: initialHackathon.description,
            start_date: toInputValue(initialHackathon.start_date),
            end_date: toInputValue(initialHackathon.end_date),
            registration_deadline: toInputValue(initialHackathon.registration_deadline),
            location: initialHackathon.location ?? "",
            is_online: initialHackathon.is_online,
            max_team_size: initialHackathon.max_team_size,
            rules: initialHackathon.rules ?? "",
            status: initialHackathon.status,
          }
        : EMPTY_VALUES
    );
  }, [open, initialHackathon]);

  if (!open) return null;

  function update<K extends keyof HackathonFormValues>(key: K, value: HackathonFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="relative w-full max-w-lg rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: `1px solid ${adminColors.border}` }}
        >
          <span style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 16 }}>
            {mode === "create" ? "Créer un hackathon" : "Modifier le hackathon"}
          </span>
          <button onClick={onClose} style={{ color: adminColors.muted }} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(values);
          }}
          className="px-5 py-4 flex flex-col gap-3.5 overflow-y-auto"
        >
          <Field label="Titre" value={values.title} onChange={(v) => update("title", v)} required />

          <label className="flex flex-col gap-1">
            <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>Description</span>
            <textarea
              value={values.description}
              required
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              style={{ fontFamily: adminFonts.body, color: adminColors.text, border: `1px solid ${adminColors.border}` }}
              className="rounded-md px-3 py-2 text-sm outline-none resize-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Début"
              type="datetime-local"
              value={values.start_date}
              onChange={(v) => update("start_date", v)}
              required
            />
            <Field
              label="Fin"
              type="datetime-local"
              value={values.end_date}
              onChange={(v) => update("end_date", v)}
              required
            />
          </div>
          <Field
            label="Date limite d'inscription"
            type="datetime-local"
            value={values.registration_deadline}
            onChange={(v) => update("registration_deadline", v)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Field label="Lieu" value={values.location} onChange={(v) => update("location", v)} />
            <Field
              label="Taille max. d'équipe"
              type="number"
              value={String(values.max_team_size)}
              onChange={(v) => update("max_team_size", Number(v))}
              required
            />
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={values.is_online} onChange={(e) => update("is_online", e.target.checked)} />
            <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13 }}>Événement en ligne</span>
          </label>

          <label className="flex flex-col gap-1">
            <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>Règlement</span>
            <textarea
              value={values.rules}
              onChange={(e) => update("rules", e.target.value)}
              rows={3}
              style={{ fontFamily: adminFonts.body, color: adminColors.text, border: `1px solid ${adminColors.border}` }}
              className="rounded-md px-3 py-2 text-sm outline-none resize-none"
            />
          </label>

          {mode === "edit" && (
            <label className="flex flex-col gap-1">
              <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>Statut</span>
              <select
                value={values.status}
                onChange={(e) => update("status", e.target.value)}
                style={{
                  fontFamily: adminFonts.body,
                  color: adminColors.text,
                  border: `1px solid ${adminColors.border}`,
                  background: adminColors.bg,
                }}
                className="rounded-md px-3 py-2 text-sm outline-none"
              >
                {HACKATHON_STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              style={{ fontFamily: adminFonts.body, color: adminColors.text, border: `1px solid ${adminColors.border}`, fontSize: 13.5 }}
              className="px-4 py-2 rounded-md hover:opacity-70"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                fontFamily: adminFonts.body,
                color: "#fff",
                background: adminColors.accent,
                fontSize: 13.5,
                opacity: submitting ? 0.6 : 1,
              }}
              className="px-4 py-2 rounded-md font-medium hover:opacity-90"
            >
              {submitting ? "Enregistrement…" : mode === "create" ? "Créer" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        style={{ fontFamily: adminFonts.body, color: adminColors.text, border: `1px solid ${adminColors.border}` }}
        className="rounded-md px-3 py-2 text-sm outline-none"
      />
    </label>
  );
}
