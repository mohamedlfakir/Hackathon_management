import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { adminColors, adminFonts } from "../../../theme/adminTokens";

export interface HackathonFormValues {
  title: string;
  description: string;
    theme: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  max_team_size: number;
  rules: string;
  location: string;
  is_online: boolean;
}

interface HackathonFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: HackathonFormValues) => void | Promise<void>;
}

const INITIAL_VALUES: HackathonFormValues = {
  title: "",
  description: "",
  theme: "",
  start_date: "",
  end_date: "",
  registration_deadline: "",
  max_team_size: 4,
  rules: "",
  location: "",
  is_online: true,
};

export default function HackathonFormModal({ open, mode, submitting, onClose, onSubmit }: HackathonFormModalProps) {
  const [values, setValues] = useState<HackathonFormValues>(INITIAL_VALUES);

  // Réinitialiser le formulaire à chaque ouverture
  useEffect(() => {
    if (open) {
      setValues(INITIAL_VALUES);
    }
  }, [open]);

  if (!open) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: checked }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        style={{ background: adminColors.surface }}
        className="w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${adminColors.border}` }} className="px-5 py-4 flex items-center justify-between">
          <h2 style={{ fontFamily: adminFonts.heading, color: adminColors.text }} className="text-base font-bold">
            {mode === "create" ? "Nouveau Hackathon" : "Modifier le Hackathon"}
          </h2>
          <button 
            onClick={onClose} 
            style={{ color: adminColors.muted }}
            className="p-1 rounded-md hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
              Titre du Hackathon *
            </label>
            <input
              type="text"
              name="title"
              required
              value={values.title}
              onChange={handleChange}
              placeholder="Ex: Prototype Sprint Challenge"
              style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
              className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent"
            />
          </div>

        <div>
            <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
              Theme du Hackathon *
            </label>
            <input
              type="text"
              name="theme"
              required
              value={values.theme}
              onChange={handleChange}
              placeholder="Ex: Prototype Sprint Challenge"
              style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
              className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent"
            />
          </div>

          <div>
            <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              value={values.description}
              onChange={handleChange}
              placeholder="Présentation générale du projet, des objectifs et des technologies attendues..."
              style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
              className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
                Début de l'événement *
              </label>
              <input
                type="date"
                name="start_date"
                required
                value={values.start_date}
                onChange={handleChange}
                style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
                className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent"
              />
            </div>
            <div>
              <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
                Fin de l'événement *
              </label>
              <input
                type="date"
                name="end_date"
                required
                value={values.end_date}
                onChange={handleChange}
                style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
                className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent"
              />
            </div>
            <div>
              <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
                Clôture inscriptions *
              </label>
              <input
                type="date"
                name="registration_deadline"
                required
                value={values.registration_deadline}
                onChange={handleChange}
                style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
                className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
                Taille max des équipes *
              </label>
              <input
                type="number"
                name="max_team_size"
                min={1}
                max={10}
                required
                value={values.max_team_size}
                onChange={handleChange}
                style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
                className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent"
              />
            </div>

            <div className="flex flex-col justify-end pb-2">
              <label style={{ fontFamily: adminFonts.body }} className="flex items-center gap-2 text-xs font-semibold select-none cursor-pointer">
                <input
                  type="checkbox"
                  name="is_online"
                  checked={values.is_online}
                  onChange={handleCheckboxChange}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
                L'événement se déroule en ligne
              </label>
            </div>
          </div>

          {!values.is_online && (
            <div className="animate-fade-in">
              <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
                Lieu / Adresse physique *
              </label>
              <input
                type="text"
                name="location"
                required={!values.is_online}
                value={values.location}
                onChange={handleChange}
                placeholder="Ex: Hémicycle B, Espace Crésus, Paris"
                style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
                className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent"
              />
            </div>
          )}

          <div>
            <label style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="block text-xs font-semibold mb-1.5">
              Règlement & Critères d'évaluation
            </label>
            <textarea
              name="rules"
              rows={3}
              value={values.rules}
              onChange={handleChange}
              placeholder="Indiquez les règles principales ou barèmes..."
              style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}` }}
              className="w-full px-3 py-2 rounded-md text-sm outline-none focus:border-indigo-500 bg-transparent resize-none"
            />
          </div>

          {/* Footer actions */}
          <div style={{ borderTop: `1px solid ${adminColors.border}` }} className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{ fontFamily: adminFonts.body, color: adminColors.text, border: `1px solid ${adminColors.border}` }}
              className="px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ fontFamily: adminFonts.body, backgroundColor: adminColors.accent }}
              className="px-4 py-2 rounded-md text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? "Enregistrement..." : mode === "create" ? "Créer" : "Sauvegarder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}