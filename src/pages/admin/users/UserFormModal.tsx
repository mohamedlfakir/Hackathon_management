// src/components/admin/users/UserFormModal.tsx
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { adminColors, adminFonts, roleLabels } from "../../../theme/adminTokens";
import type { User } from "../../../api/user.api";

export interface UserFormValues {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  role: User["role"];
  password?: string;
}

const ROLE_OPTIONS: User["role"][] = ["ADMIN", "ORGANIZER", "JUDGE", "PARTICIPANT"];
const EMPTY_VALUES: UserFormValues = {
  username: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "PARTICIPANT",
  password: "",
};

export default function UserFormModal({
  open,
  mode,
  initialUser,
  submitting,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initialUser?: User | null;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
}) {
  const [values, setValues] = useState<UserFormValues>(EMPTY_VALUES);

  // Reset the form whenever it opens, prefilling from the user being edited.
  useEffect(() => {
    if (!open) return;
    setValues(
      initialUser
        ? {
            username: initialUser.username,
            first_name: initialUser.first_name,
            last_name: initialUser.last_name,
            email: initialUser.email,
            role: initialUser.role,
            password: "",
          }
        : EMPTY_VALUES
    );
  }, [open, initialUser]);

  if (!open) return null;

  function update<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="relative w-full max-w-md rounded-xl shadow-xl overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${adminColors.border}` }}
        >
          <span style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 16 }}>
            {mode === "create" ? "Ajouter un utilisateur" : "Modifier l'utilisateur"}
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
          className="px-5 py-4 flex flex-col gap-3.5"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" value={values.first_name} onChange={(v) => update("first_name", v)} required />
            <Field label="Nom" value={values.last_name} onChange={(v) => update("last_name", v)} required />
          </div>
          <Field label="Nom d'utilisateur" value={values.username} onChange={(v) => update("username", v)} required />
          <Field label="Email" type="email" value={values.email} onChange={(v) => update("email", v)} required />
          {mode === "create" && (
            <Field
              label="Mot de passe"
              type="password"
              value={values.password ?? ""}
              onChange={(v) => update("password", v)}
              required
            />
          )}

          <label className="flex flex-col gap-1">
            <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>Rôle</span>
            <select
              value={values.role}
              onChange={(e) => update("role", e.target.value as User["role"])}
              style={{
                fontFamily: adminFonts.body,
                color: adminColors.text,
                border: `1px solid ${adminColors.border}`,
                background: adminColors.bg,
              }}
              className="rounded-md px-3 py-2 text-sm outline-none"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r.toLowerCase()] ?? r}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center justify-end gap-2 pt-2">
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
              {submitting ? "Enregistrement…" : mode === "create" ? "Ajouter" : "Enregistrer"}
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