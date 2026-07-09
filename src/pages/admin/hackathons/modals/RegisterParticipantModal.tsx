import React, { useState } from "react";
import { X, Loader2, User, Users } from "lucide-react";
import * as hackathonService from "../../../../services/hackathon.service";

interface RegisterParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: number;
  onSuccess: () => void;
}

type RegistrationType = "solo" | "team";

export default function RegisterParticipantModal({
  isOpen,
  onClose,
  hackathonId,
  onSuccess,
}: RegisterParticipantModalProps): React.JSX.Element | null {
  
  const [regType, setRegType] = useState<RegistrationType>("solo");
  const [targetId, setTargetId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setTargetId("");
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const idToRegister = Number(targetId);

    if (!targetId || isNaN(idToRegister) || idToRegister <= 0) {
      setErrorMessage(`Veuillez entrer un ID de ${regType === "solo" ? "l'utilisateur" : "l'équipe"} valide.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (regType === "solo") {
        // Appelle la méthode d'inscription individuelle
        await hackathonService.assignUserByAdmin(hackathonId, idToRegister);
      } else {
        // Appelle la méthode d'inscription d'équipe
        await hackathonService.registerTeam(hackathonId, idToRegister);
      }

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'inscription manuelle :", error);
      setErrorMessage(
        `Impossible d'inscrire ce candidat. Vérifiez que l'ID existe et qu'il n'est pas déjà enregistré.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden transform transition-all scale-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Inscrire un Participant</h3>
            <p className="text-xs text-gray-500">Ajouter manuellement une entité à cet événement.</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 text-sm bg-red-50 border border-red-100 text-red-600 rounded-lg font-medium">
              {errorMessage}
            </div>
          )}

          {/* Sélecteur de type d'entité */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Type d'engagement</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRegType("solo")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  regType === "solo"
                    ? "border-gray-900 bg-gray-50/50 text-gray-900"
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                }`}
              >
                <User className="w-4 h-4" />
                Développeur Solo
              </button>
              <button
                type="button"
                onClick={() => setRegType("team")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  regType === "team"
                    ? "border-gray-900 bg-gray-50/50 text-gray-900"
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200"
                }`}
              >
                <Users className="w-4 h-4" />
                Équipe Entière
              </button>
            </div>
          </div>

          {/* Saisie de l'identifiant numérique */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {regType === "solo" ? "ID numérique de l'Utilisateur" : "ID numérique de l'Équipe"}
            </label>
            <input
              type="number"
              min={1}
              required
              placeholder={regType === "solo" ? "Ex: 42" : "Ex: 108"}
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:bg-gray-400"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Valider l'inscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}