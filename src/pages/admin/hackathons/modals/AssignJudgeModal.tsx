import React, { useState } from "react";
import { X, Loader2, Gavel } from "lucide-react";
import * as hackathonService from "../../../../services/hackathon.service";

interface AssignJudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathonId: number;
  onSuccess: () => void;
}

export default function AssignJudgeModal({
  isOpen,
  onClose,
  hackathonId,
  onSuccess,
}: AssignJudgeModalProps): React.JSX.Element | null {
  
  const [judgeId, setJudgeId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setJudgeId("");
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericJudgeId = Number(judgeId);

    if (!judgeId || isNaN(numericJudgeId) || numericJudgeId <= 0) {
      setErrorMessage("Veuillez entrer un ID de juge numérique valide.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Appel au service pour lier le juge au hackathon
      await hackathonService.assignJudge(hackathonId, numericJudgeId);

      onSuccess(); // Recharge la section des juges sur la page principale
      handleClose();
    } catch (error) {
      console.error("Erreur lors de l'assignation du juge :", error);
      setErrorMessage(
        "Impossible d'assigner ce juge. Vérifiez que l'ID utilisateur existe, possède le rôle adéquat et n'est pas déjà membre du jury."
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
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Assigner un Juge</h3>
              <p className="text-xs text-gray-500">Ajouter un expert pour évaluer les projets.</p>
            </div>
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

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Identifiant du Juge (ID utilisateur)
            </label>
            <input
              type="number"
              min={1}
              required
              placeholder="Ex: 14"
              value={judgeId}
              onChange={(e) => setJudgeId(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Le compte ciblé doit être préalablement enregistré sur la plateforme avec des privilèges de juré ou de membre technique.
            </p>
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
              Confirmer l'affectation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}