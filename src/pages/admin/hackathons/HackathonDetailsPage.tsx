import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Activity } from "lucide-react";

// Importation de notre service hackathon
import * as hackathonService from "../../../services/hackathon.service";

// Importation de nos sous-sections graphiques
import HackathonInfoSection from "./HackathonInfoSection";
import HackathonJudgesSection from "./HackathonJudgesSection";
import HackathonParticipantsSection from "./HackathonParticipantsSection";
import HackathonSubmissionsSection from "./HackathonSubmissionsSection";

// Importation des types de l'API
import type { Hackathon , RankedSubmissionItem} from "../../../api/hackathon.api";
import type { Judge } from "./HackathonJudgesSection";
import type { ParticipantItem } from "./HackathonParticipantsSection";
import type { SubmissionItem } from "./HackathonSubmissionsSection";
import EditHackathonModal from "./modals/EditHackathonModal";
import UpdateStatusModal from "./modals/UpdateStatusModal";
import RegisterParticipantModal from "./modals/RegisterParticipantModal";
import AssignJudgeModal from "./modals/AssignJudgeModal";
import RankedSubmissionsSection from "./RankedSubmissionsSection";
import HackathonPodiumSection from "../../public/HackathonPodiumSection";

// ============================================================================
// COMPOSANT PAGE PRINCIPALE ACTIVÉ
// ============================================================================
export default function HackathonDetailsPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hackathonId = Number(id);

  // ÉTATS DES DONNÉES DE LA PAGE
  const [rankedSubmissions, setRankedSubmissions] = useState<RankedSubmissionItem[]>([]);
  const [hackathonWinners, sethackathonWinners] = useState<RankedSubmissionItem[]>([]);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [judges, setJudges] = useState<Judge[]>([]);
  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ÉTATS DE CONTRÔLE DES MODALES
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAssignJudgeModalOpen, setIsAssignJudgeModalOpen] = useState(false);

  // CHARGEMENT SYNCHRONISÉ DES SERVICES VIA PROMISE.ALL
  const loadPageData = async () => {
    if (isNaN(hackathonId)) {
      setError("Identifiant de hackathon invalide.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [hackathonData, judgesData, participantsData, submissionsData, rankedSubmissionsData] = await Promise.all([
        hackathonService.getHackathonById(hackathonId),
        hackathonService.getHackathonJudges(hackathonId),
        hackathonService.getHackathonParticipants(hackathonId),
        hackathonService.getHackathonSubmissions(hackathonId),
        hackathonService.getHackathonRanking(hackathonId),
      ]);

      setHackathon(hackathonData);
      setJudges(judgesData || []);
      setSubmissions(submissionsData || []);

      setRankedSubmissions(rankedSubmissionsData.data);
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

      // Normalisation défensive au cas où l'API renvoie une structure brute différente de l'interface UI
      const normalizedParticipants: ParticipantItem[] = (participantsData || []).map((p: any) => ({
        id: p.participant_id,
        type: p.participant_type,
        name: p.team_name || `${p.first_name || ""} ${p.last_name || ""}`.trim(),
        email: p.email || "Non renseigné",
        memberCount: p.memberCount || 1,
      }));
      
      setParticipants(normalizedParticipants);

    } catch (err) {
      console.error("Erreur de chargement de la page Hackathon:", err);
      setError("Une erreur est survenue lors de la récupération des données du hackathon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, [hackathonId]);

  // ACTIONS ADMINISTRATIVE DIRECTES SUR LES COMPOSANTS
  const handleRemoveJudge = async (judgeId: number) => {
    try {
      await hackathonService.removeJudge(hackathonId, judgeId);
      // Mise à jour de l'état local après succès de la suppression côté API
      setJudges((prev) => prev.filter((j) => j.id !== judgeId));
    } catch (err) {
      console.error("Erreur lors de la suppression du juge :", err);
      alert("Impossible de retirer le juge pour le moment.");
    }
  };

  const handleViewSubmission = (submissionId: number) => {
    navigate(`/myspace/submissions/${submissionId}`);
  };

  // Traitement des écrans d'attente et d'erreur
  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-sm font-medium animate-pulse">Chargement du tableau de bord d'administration...</div>;
  }
  
  if (error || !hackathon) {
    return <div className="text-center py-20 text-red-600 font-medium">{error || "Hackathon introuvable."}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* HEADER DE LA PAGE */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-2">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Retour au tableau de bord
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

        <div className="flex gap-2 self-start md:self-auto w-full md:w-auto">
          <button 
            onClick={() => setIsStatusModalOpen(true)}
            className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
          >
            <Activity className="w-4 h-4 mr-2 text-gray-500" />
            Statut
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 md:flex-initial inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 shadow-sm transition-all"
          >
            <Edit className="w-4 h-4 mr-2" />
            Modifier
          </button>
        </div>
      </div>

      {/* ================= SECTION VAINQUEURS AU TOP (PLEINE LARGEUR) ================= */}
    {hackathon.status?.toLowerCase() === "finished" && (
      <HackathonPodiumSection winners={hackathonWinners} />
    )}
    
      {/* DISPOSITION EN GRILLE DE L'ADMINISTRATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Contenu principal (Gauche - 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <HackathonInfoSection hackathon={hackathon} />
          <HackathonSubmissionsSection 
            submissions={submissions} 
            onViewSubmission={handleViewSubmission} 
          />
        </div>

        {/* Panneaux de contrôles latéraux (Droite - 1/3) */}
        <div className="space-y-6">
          <HackathonJudgesSection 
            judges={judges} 
            onOpenAssignModal={() => setIsAssignJudgeModalOpen(true)} 
            onRemoveJudge={handleRemoveJudge} 
          />
          <HackathonParticipantsSection 
            participants={participants} 
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)} 
          />

          <RankedSubmissionsSection
            submissions={rankedSubmissions}
            onViewDetails={handleViewSubmission}
          />
        </div>

      </div>

      {/* SYSTÈME DE MODALES DE LA PAGE */}
        <EditHackathonModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        hackathon={hackathon}
        onSuccess={loadPageData} // Déclenche le rechargement immédiat de la structure
        />   
        <UpdateStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} hackathon={hackathon} onSuccess={loadPageData} />
            <RegisterParticipantModal 
            isOpen={isRegisterModalOpen} 
            onClose={() => setIsRegisterModalOpen(false)} 
            hackathonId={hackathonId}
            onSuccess={loadPageData} // Rafraîchit la liste des participants à l'écran
            />
            
        <AssignJudgeModal 
        isOpen={isAssignJudgeModalOpen} 
        onClose={() => setIsAssignJudgeModalOpen(false)} 
        hackathonId={hackathonId}
        onSuccess={loadPageData} // Déclenche la mise à jour visuelle du tableau des juges
        />      
    </div>
  );
}