// src/pages/participant/modals/RegisterParticipantModal.tsx
import React, { useState } from "react";
import { X, User, Users, Loader2, AlertCircle } from "lucide-react";
import * as hackathonService from "../../../../services/hackathon.service";
// Ajuste l'import de ton TeamService selon ton arborescence actuelle
import * as teamService from "../../../../services/team.service"; 

interface RegisterParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: number;
  onSuccess: () => void;
}

export default function RegisterParticipantModal({
  isOpen,
  onClose,
  hackathonId,
  onSuccess,
}: RegisterParticipantModalProps): React.JSX.Element | null {
  // GESTION DES ÉTATS DU FORMULAIRE
  const [regType, setRegType] = useState<"solo" | "team">("solo");
  const [teamName, setTeamName] = useState<string>("");
  const [teamDescription, setTeamDescription] = useState<string>("");
  
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (regType === "solo") {
        // Appelle ton service d'inscription solo (ajuste le nom si nécessaire)
        await hackathonService.registerParticipant(hackathonId);
      } else {
        // Validation basique côté client pour l'équipe
        if (!teamName.trim()) {
          throw new Error("Le nom de l'équipe est obligatoire.");
        }
        // Appelle ton service de création d'équipe
        await teamService.createTeam({hackathon_id: hackathonId,
          name: teamName.trim(),
          description: teamDescription.trim()},
        );
      }

      // Réinitialisation et fermeture en cas de succès
      setTeamName("");
      setTeamDescription("");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de l'inscription :", err);
      setError(
        err.message || "Une erreur est survenue lors de votre inscription. Veuillez réessayez."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* EN-TÊTE DE LA MODALE */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-base font-bold text-gray-900">Rejoindre le hackathon</h3>
            <p className="text-xs text-gray-500 mt-0.5">Choisissez votre mode de participation</p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-5">
          
          {/* AFFICHAGE DES ERREURS GLOBALES */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* SÉLECTEUR VISUEL : SOLO VS ÉQUIPE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Type d'aventure
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Option Solo */}
              <button
                type="button"
                onClick={() => !submitting && setRegType("solo")}
                className={`p-4 border rounded-xl flex flex-col items-center text-center gap-2 transition-all ${
                  regType === "solo"
                    ? "border-indigo-600 bg-indigo-50/40 text-indigo-600 ring-2 ring-indigo-600/10"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <User className={`w-5 h-5 ${regType === "solo" ? "text-indigo-600" : "text-gray-400"}`} />
                <div>
                  <p className="text-sm font-bold">En Solo</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Je participe seul</p>
                </div>
              </button>

              {/* Option Équipe */}
              <button
                type="button"
                onClick={() => !submitting && setRegType("team")}
                className={`p-4 border rounded-xl flex flex-col items-center text-center gap-2 transition-all ${
                  regType === "team"
                    ? "border-indigo-600 bg-indigo-50/40 text-indigo-600 ring-2 ring-indigo-600/10"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Users className={`w-5 h-5 ${regType === "team" ? "text-indigo-600" : "text-gray-400"}`} />
                <div>
                  <p className="text-sm font-bold">En Équipe</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Créer un collectif</p>
                </div>
              </button>
            </div>
          </div>

          {/* CHAMPS COMPLÉMENTAIRES ÉQUIPE (Affichés conditionnellement) */}
          {regType === "team" && (
            <div className="space-y-4 pt-2 border-t border-gray-100 animate-slide-down">
              {/* Nom de l'équipe */}
              <div className="space-y-1.5">
                <label htmlFor="teamName" className="text-xs font-bold text-gray-700">
                  Nom de l'équipe <span className="text-red-500">*</span>
                </label>
                <input
                  id="teamName"
                  type="text"
                  required
                  disabled={submitting}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ex: Les Syntaxicients"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>

              {/* Description de l'équipe */}
              <div className="space-y-1.5">
                <label htmlFor="teamDesc" className="text-xs font-bold text-gray-700">
                  Description du projet ou de l'équipe
                </label>
                <textarea
                  id="teamDesc"
                  rows={3}
                  disabled={submitting}
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Décrivez brièvement vos compétences ou l'idée générale de votre projet..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all resize-none disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>
          )}

          {/* PIED DE PAGE / BOUTONS D'ACTION */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-80"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {regType === "solo" ? "Confirmer mon inscription" : "Créer l'équipe & Rejoindre"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}