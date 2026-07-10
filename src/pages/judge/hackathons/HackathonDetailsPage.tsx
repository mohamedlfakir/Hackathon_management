import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Importation de notre service hackathon
import * as hackathonService from "../../../services/hackathon.service";

// Importation de nos sous-sections graphiques (uniquement celles autorisées pour le jury)
import HackathonInfoSection from "./HackathonInfoSection";
import HackathonSubmissionsSection from "./HackathonSubmissionsSection";

// Importation des types de l'API
import type { Hackathon , RankedSubmissionItem} from "../../../api/hackathon.api";
import type { SubmissionItem } from "./HackathonSubmissionsSection";
import HackathonPodiumSection from "../../public/HackathonPodiumSection";

// ============================================================================
// COMPOSANT PAGE PRINCIPALE JURY
// ============================================================================
export default function HackathonJudgeDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hackathonId = Number(id);

  // ÉTATS DES DONNÉES DE LA PAGE
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [hackathonWinners, sethackathonWinners] = useState<RankedSubmissionItem[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // CHARGEMENT UNIQUEMENT DES DONNÉES UTILES AU JURY
  const loadPageData = async () => {
    if (isNaN(hackathonId)) {
      setError("Identifiant de hackathon invalide.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [hackathonData, submissionsData] = await Promise.all([
        hackathonService.getHackathonById(hackathonId),
        hackathonService.getHackathonSubmissions(hackathonId) // Pour voir les projets à évaluer
      ]);

      setHackathon(hackathonData);
      setSubmissions(submissionsData || []);

      if (hackathonData?.status?.toUpperCase() === "FINISHED") {
        try {
          const hackathonWinnersData = await hackathonService.getHackathonWinners(hackathonId);
          sethackathonWinners(hackathonWinnersData?.data || hackathonWinnersData || []);
        } catch (winnerErr) {
          // Sécurité additionnelle : si l'API des vainqueurs échoue, on n'arrête pas toute la page
          console.error("Erreur lors de la récupération des vainqueurs:", winnerErr);
          sethackathonWinners([]);
        }
      } else {
        // Si le hackathon n'est pas fini, on vide explicitement l'état des vainqueurs
        sethackathonWinners([]);
      }
    } catch (err) {
      console.error("Erreur de chargement de la page Hackathon (Juge):", err);
      setError("Une erreur est survenue lors de la récupération des données du hackathon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [hackathonId]);

  const handleViewSubmission = (submissionId: number) => {
    // Redirection vers l'interface d'évaluation du juge au lieu de l'admin
    navigate(`/myspace/submissions/${submissionId}`);
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-sm font-medium animate-pulse">Chargement de l'espace d'évaluation...</div>;
  }
  
  if (error || !hackathon) {
    return <div className="text-center py-20 text-red-600 font-medium">{error || "Hackathon introuvable."}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Retour à mes hackathons
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {hackathon.title}
            </h1>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {hackathon.status}
            </span>
          </div>
        </div>
      </div>

      {/* ================= SECTION VAINQUEURS AU TOP (PLEINE LARGEUR) ================= */}
        {hackathon.status?.toLowerCase() === "finished" && (
          <HackathonPodiumSection winners={hackathonWinners} />
        )}
        
      {/* DISPOSITION SIMPLIFIÉE (Plus besoin de grid 3 colonnes sans les sidebars) */}
      <div className="space-y-6">
        <HackathonInfoSection hackathon={hackathon} />
        
        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Projets à évaluer</h2>
          <HackathonSubmissionsSection 
            submissions={submissions} 
            onViewSubmission={handleViewSubmission} 
          />
        </div>
      </div>
  
    </div>
  );
}