// src/pages/admin/ConfirmDialog.tsx
import { AlertCircle, Loader2 } from "lucide-react";
import { adminColors, adminFonts } from "../../../theme/adminTokens";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  submitting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  danger = false,
  submitting = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  if (!open) return null;

  // Détermination de la couleur principale selon l'action (danger ou normale)
  const actionColor = danger ? adminColors.danger : adminColors.accent;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="w-full max-w-md rounded-xl shadow-xl overflow-hidden p-5 flex flex-col gap-4 transform transition-all scale-100"
      >
        {/* En-tête avec icône d'avertissement */}
        <div className="flex items-start gap-3🏙️">
          {danger && (
            <div 
              style={{ background: `${adminColors.danger}15`, color: adminColors.danger }}
              className="p-2 rounded-full shrink-0"
            >
              <AlertCircle size={20} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3
              style={{ fontFamily: adminFonts.heading, color: adminColors.text }}
              className="text-base font-bold leading-6"
            >
              {title}
            </h3>
            <p
              style={{ fontFamily: adminFonts.body, color: adminColors.muted }}
              className="text-xs mt-1.5 leading-relaxed"
            >
              {description}
            </p>
          </div>
        </div>

        {/* Pied de page / Actions */}
        <div className="flex items-center justify-end gap-2 mt-2">
          <button
            type="button"
            disabled={submitting}
            onClick={onCancel}
            style={{ 
              fontFamily: adminFonts.body, 
              border: `1px solid ${adminColors.border}`, 
              color: adminColors.text 
            }}
            className="px-4 py-2 bg-white rounded-md text-xs font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
          
          <button
            type="button"
            disabled={submitting}
            onClick={onConfirm}
            style={{ 
              fontFamily: adminFonts.body, 
              background: actionColor,
              color: "#fff" 
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}