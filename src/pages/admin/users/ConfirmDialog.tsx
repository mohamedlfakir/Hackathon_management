// src/components/admin/users/ConfirmDialog.tsx
import { adminColors, adminFonts } from "../../../theme/adminTokens";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  danger,
  submitting,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  submitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onCancel} />
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="relative w-full max-w-sm rounded-xl shadow-xl p-5"
      >
        <h3 style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 16 }}>{title}</h3>
        <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }} className="mt-2">
          {description}
        </p>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            style={{ fontFamily: adminFonts.body, color: adminColors.text, border: `1px solid ${adminColors.border}`, fontSize: 13.5 }}
            className="px-4 py-2 rounded-md hover:opacity-70"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            style={{
              fontFamily: adminFonts.body,
              color: "#fff",
              background: danger ? adminColors.danger : adminColors.accent,
              fontSize: 13.5,
              opacity: submitting ? 0.6 : 1,
            }}
            className="px-4 py-2 rounded-md font-medium hover:opacity-90"
          >
            {submitting ? "…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}