import React from "react";
import { Calendar, MapPin, Globe, Users, BookOpen, FileText } from "lucide-react";
import type { Hackathon } from "../../../api/hackathon.api";

interface HackathonInfoSectionProps {
  hackathon: Hackathon;
}

export default function HackathonInfoSection({ hackathon }: HackathonInfoSectionProps): React.JSX.Element {
  
  // Formatage simple des dates pour une lecture admin propre
  const formatDate = (dateString: string) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* En-tête de la section */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-lg text-gray-900">Détails de l'événement</h3>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Grille d'informations clés (Métadonnées) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Dates de l'événement */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Période du Hackathon</span>
              <p className="text-sm font-medium text-gray-900">
                Du : <span className="text-gray-700 font-normal">{formatDate(hackathon.start_date)}</span>
              </p>
              <p className="text-sm font-medium text-gray-900">
                Au : <span className="text-gray-700 font-normal">{formatDate(hackathon.end_date)}</span>
              </p>
            </div>
          </div>

          {/* Date limite d'inscription */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Inscriptions</span>
              <p className="text-sm font-medium text-gray-950">
                Date limite :
              </p>
              <p className="text-sm text-amber-900 bg-amber-50 inline-block px-2 py-0.5 rounded border border-amber-200">
                {formatDate(hackathon.registration_deadline)}
              </p>
            </div>
          </div>

          {/* Lieu ou Format */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            {hackathon.is_online ? (
              <Globe className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            ) : (
              <MapPin className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            )}
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Lieu / Format</span>
              <p className="text-sm font-medium text-gray-900">
                {hackathon.is_online ? "En ligne (Remote)" : "Présentiel"}
              </p>
              {hackathon.location && (
                <p className="text-sm text-gray-600 truncate max-w-xs" title={hackathon.location}>
                  {hackathon.location}
                </p>
              )}
            </div>
          </div>

          {/* Taille d'équipe maximale */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-purple-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Logistique Équipe</span>
              <p className="text-sm font-medium text-gray-900"> Taille max autorisée :</p>
              <p className="text-sm text-gray-600">
                {hackathon.max_team_size} {hackathon.max_team_size > 1 ? "personnes par équipe" : "participant solo"}
              </p>
            </div>
          </div>

        </div>

        <hr className="border-gray-100" />

        {/* 2. Bloc Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Description</h4>
          <div className="text-sm text-gray-700 leading-relaxed bg-white border border-gray-100 rounded-lg p-4 shadow-inner whitespace-pre-wrap">
            {hackathon.description || <span className="text-gray-400 italic">Aucune description fournie.</span>}
          </div>
        </div>

        {/* 3. Bloc Règlement / Règles */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-gray-500" />
            <h4>Règlement intérieur</h4>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 border border-gray-100 rounded-lg p-4 whitespace-pre-wrap">
            {hackathon.rules || <span className="text-gray-400 italic">Aucun règlement spécifique rédigé pour cet événement.</span>}
          </div>
        </div>

      </div>
    </div>
  );
}