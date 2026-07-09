import React, { useState, useEffect } from "react";
import { X, Loader2, Calendar, Lock, Play, CheckCircle2 } from "lucide-react";
import * as hackathonService from "../../../../services/hackathon.service";
import type { Hackathon } from "../../../../api/hackathon.api";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: Hackathon;
  onSuccess: () => void;
}

// Alignement exact sur tes statuts
type HackathonStatus = "OPEN" | "CLOSED" | "FINISHED" | "UPCOMING";

interface StatusOption {
  value: HackathonStatus;
  label: string;
  description: string;
  colorClass: string;
  bgClass: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: "UPCOMING",
    label: "Planifié / À venir",
    description: "L'événement est créé mais les inscriptions ne sont pas encore ouvertes aux participants.",
    colorClass: "text-blue-700 border-blue-200",
    bgClass: "bg-blue-50/50",
    icon: Calendar,
  },
  {
    value: "OPEN",
    label: "Ouvert / En cours",
    description: "Les inscriptions sont ouvertes et les équipes peuvent activement coder et soumettre leurs projets.",
    colorClass: "text-amber-700 border-amber-200",
    bgClass: "bg-amber-50/50",
    icon: Play,
  },
  {
    value: "CLOSED",
    label: "Fermé / Évaluation",
    description: "Les inscriptions et les soumissions sont verrouillées. Phase d'évaluation par le jury.",
    colorClass: "text-purple-700 border-purple-200",
    bgClass: "bg-purple-50/50",
    icon: Lock,
  },
  {
    value: "FINISHED",
    label: "Terminé / Clôturé",
    description: "Le hackathon est entièrement terminé, le classement et les vainqueurs sont figés.",
    colorClass: "text-emerald-700 border-emerald-200",
    bgClass: "bg-emerald-50/50",
    icon: CheckCircle2,
  },
];

export default function UpdateStatusModal({
  isOpen,
  onClose,
  hackathon,
  onSuccess,
}: UpdateStatusModalProps): React.JSX.Element | null {
  
  const [selectedStatus, setSelectedStatus] = useState<HackathonStatus>((hackathon?.status as HackathonStatus) || "UPCOMING");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && hackathon) {
      setSelectedStatus(hackathon.status as HackathonStatus);
      setErrorMessage(null);
    }
  }, [isOpen, hackathon]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus === hackathon.status) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await hackathonService.updateHackathon(hackathon.id, {
        status: selectedStatus,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error);
      setErrorMessage("Impossible de mettre à jour le statut. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Piloter le Statut</h3>
            <p className="text-xs text-gray-500">
              Statut actuel : <span className="font-semibold text-gray-700">{hackathon.status}</span>
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire & Options */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 text-sm bg-red-50 border border-red-100 text-red-600 rounded-lg font-medium">
              {errorMessage}
            </div>
          )}

          <div className="space-y-3">
            {STATUS_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              const isCurrent = hackathon.status === option.value;
              const isSelected = selectedStatus === option.value;

              return (
                <div
                  key={option.value}
                  onClick={() => !isSubmitting && setSelectedStatus(option.value)}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected 
                      ? "border-gray-900 bg-gray-50/40 shadow-sm" 
                      : "border-gray-100 hover:border-gray-200 bg-white"
                  }`}
                >
                  <div className={`p-2 rounded-lg border ${option.colorClass} ${option.bgClass} mt-0.5 shrink-0`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-900">{option.label}</p>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-gray-100 text-gray-600 border border-gray-200 rounded">
                          Actuel
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {option.description}
                    </p>
                  </div>

                  <div className="flex items-center h-5 shrink-0">
                    <input
                      type="radio"
                      name="hackathon_status"
                      checked={isSelected}
                      readOnly
                      className="h-4 w-4 text-gray-900 focus:ring-gray-950 border-gray-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || selectedStatus === hackathon.status}
              className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:bg-gray-100 disabled:text-gray-400"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Confirmer la transition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}