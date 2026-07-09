import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import * as hackathonService from "../../../../services/hackathon.service";
import type { Hackathon, UpdateHackathonRequest } from "../../../../api/hackathon.api";

interface EditHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: Hackathon;
  onSuccess: () => void; // Permet de recharger les données de la page principale après modification
}

export default function EditHackathonModal({
  isOpen,
  onClose,
  hackathon,
  onSuccess,
}: EditHackathonModalProps): React.JSX.Element | null {
  
  // États du formulaire
  const [formData, setFormData] = useState<UpdateHackathonRequest>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Utilitaire pour convertir les dates ISO du backend au format requis par <input type="datetime-local"> (YYYY-MM-DDTHH:mm)
  const formatISOToInput = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().slice(0, 16);
  };

  // Synchronisation des données lorsque la modale s'ouvre ou que le hackathon change
  useEffect(() => {
    if (isOpen && hackathon) {
      setFormData({
        title: hackathon.title,
        description: hackathon.description,
        start_date: formatISOToInput(hackathon.start_date),
        end_date: formatISOToInput(hackathon.end_date),
        registration_deadline: formatISOToInput(hackathon.registration_deadline),
        location: hackathon.location,
        is_online: hackathon.is_online,
        max_team_size: hackathon.max_team_size,
        rules: hackathon.rules,
      });
      setErrorMessage(null);
    }
  }, [isOpen, hackathon]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" 
        ? (e.target as HTMLInputElement).checked 
        : type === "number" 
          ? Number(value) 
          : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      is_online: e.target.checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Conversion des valeurs de date en chaînes ISO valides avant l'envoi à l'API
      const payload: UpdateHackathonRequest = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : undefined,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
        registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : undefined,
      };

      await hackathonService.updateHackathon(hackathon.id, payload);
      onSuccess(); // Notifie le parent du succès pour rafraîchir l'affichage
      onClose();   // Ferme la modale
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErrorMessage("Impossible de mettre à jour le hackathon. Veuillez vérifier les champs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col transform transition-all scale-100"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture lors du clic dans le formulaire
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Modifier l'événement</h3>
            <p className="text-xs text-gray-500">Mettez à jour les paramètres généraux et logistiques du hackathon.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire défilant si nécessaire */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
          {errorMessage && (
            <div className="p-3 text-sm bg-red-50 border border-red-100 text-red-600 rounded-lg font-medium">
              {errorMessage}
            </div>
          )}

          {/* Titre */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Titre du Hackathon</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Description</label>
            <textarea
              name="description"
              rows={3}
              required
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Configuration Dates (Grille 3 colonnes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Limite Inscription</label>
              <input
                type="datetime-local"
                name="registration_deadline"
                required
                value={formData.registration_deadline || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date de Début</label>
              <input
                type="datetime-local"
                name="start_date"
                required
                value={formData.start_date || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Date de Fin</label>
              <input
                type="datetime-local"
                name="end_date"
                required
                value={formData.end_date || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Logistique & Taille (Grille 2 colonnes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Lieu de l'événement</label>
              <input
                type="text"
                name="location"
                required
                disabled={formData.is_online}
                value={formData.is_online ? "Événement Virtuel (En Ligne)" : formData.location || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Taille max. des équipes</label>
              <input
                type="number"
                name="max_team_size"
                min={1}
                required
                value={formData.max_team_size || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Checkbox d'environnement en ligne */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_online"
              name="is_online"
              checked={formData.is_online || false}
              onChange={handleCheckboxChange}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="is_online" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
              Il s'agit d'un hackathon se déroulant exclusivement en ligne digital
            </label>
          </div>

          {/* Règlement intérieur */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Règlement & Critères d'évaluation</label>
            <textarea
              name="rules"
              rows={3}
              value={formData.rules || ""}
              onChange={handleChange}
              placeholder="Indiquez ici les consignes clés..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>

          {/* Footer fixe pour les actions */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-white sticky bottom-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:bg-gray-400"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Sauvegarder les changements
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}