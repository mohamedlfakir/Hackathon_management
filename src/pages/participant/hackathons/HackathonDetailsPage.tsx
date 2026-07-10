// src/pages/participant/HackathonParticipantPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Trophy, ShieldAlert, CheckCircle, Rocket, ExternalLink, Edit, FileText } from "lucide-react";
import * as TeamService from "../../../services/team.service";
// Services existants
import * as hackathonService from "../../../services/hackathon.service";
import * as submissionService from "../../../services/submission.service";

import { useAuth } from "../../../contexts/AuthContext";

// Composants de présentation conservés
import HackathonInfoSection from "./HackathonInfoSection";

// Types
import type { Hackathon,RankedSubmissionItem } from "../../../api/hackathon.api";
import RegisterParticipantModal from "./modals/RegisterParticipantModal";
import EditTeamModal from "./modals/EditTeamModal";
import SubmitProjectModal from "./modals/SubmitProjectModal";

import type { Submission } from "../../../api/submission.api";
import HackathonPodiumSection from "../../public/HackathonPodiumSection";

// Interfaces locales pour l'état du participant

interface ParticipantTeam {
  id: number;
  name: string;
  description?: string;
  avatarUrl?: string;
  leader: { id: number; first_name: string; last_name: string };
  members: { id: number; first_name: string; last_name: string; isLeader: boolean }[];
}


export default function HackathonParticipantPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const hackathonId = Number(id);

  const { user } = useAuth();

  // ÉTATS DES DONNÉES DU HACKATHON
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [hackathonWinners, sethackathonWinners] = useState<RankedSubmissionItem[]>([]);
  
  // ÉTATS CONTEXTUELS DU PARTICIPANT (Simulés/Adaptables selon vos services actuels)
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [userTeam, setUserTeam] = useState<ParticipantTeam | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);

  // ÉTATS DES MODALES (À connecter à vos futurs composants de modales)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState<boolean>(false);

  const loadPageData = async () => {
    
    if (isNaN(hackathonId)) {
      setError("Identifiant de hackathon invalide.");
      setLoading(false);
      return;
    }

  setLoading(true);
  setError(null);

  try {
    // 1. Récupération des informations générales du Hackathon
    const hackathonData = await hackathonService.getHackathonById(hackathonId); 
    setHackathon(hackathonData);

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
       
    // 2. Vérifications d'inscription (Solo et Équipe)
    const isParticipant = await hackathonService.isParticipant(hackathonId);
    const myTeamData = await TeamService.getMyTeam(hackathonId); // vaux null si pas d'équipe

    // Si l'un des deux est vrai, l'utilisateur est bien inscrit
    if (isParticipant.isParticipant || myTeamData) {
      setIsRegistered(true);
      
      if (myTeamData) {
        setUserTeam(myTeamData); // On stocke l'objet équipe complet pour l'affichage
      } else {
        setUserTeam(null); // Participation en solo
      }
    } else {
      setIsRegistered(false);
      setUserTeam(null);
    }

   
    if (isParticipant || myTeamData) {
       const submissionData = await submissionService.getMySubmission(hackathonId);
       setSubmission(submissionData);
     } else {
       setSubmission(null);
     }

  } catch (err) {
    console.error("Erreur de chargement du hackathon :", err);
    setError("Impossible de charger les détails du hackathon.");
  } finally {
    setLoading(false);
  }
};

// Détermination de la configuration visuelle selon le statut pour un non-inscrit
const registrationConfig = (() => {
  const status = hackathon?.status?.toUpperCase();

  switch (status) {
    case "CLOSED":
      return {
        message: "Les inscriptions à ce hackathon sont désormais clôturées. Il n'est plus possible de rejoindre l'événement.",
        bannerClass: "bg-gray-50 border-gray-200 text-gray-500",
        iconClass: "text-gray-400",
        btnText: "Inscriptions closes",
        isDisabled: true,
      };
    case "FINISHED":
      return {
        message: "Ce hackathon est terminé. Les inscriptions sont définitivement closes.",
        bannerClass: "bg-red-50 border-red-100 text-red-700",
        iconClass: "text-red-400",
        btnText: "Hackathon terminé",
        isDisabled: true,
      };
    case "UPCOMING":
      return {
        message: "Ce hackathon n'a pas encore débuté. Les inscriptions ouvriront très prochainement !",
        bannerClass: "bg-blue-50 border-blue-100 text-blue-700",
        iconClass: "text-blue-500",
        btnText: "Inscriptions bientôt disponibles",
        isDisabled: true,
      };
    default:
      // Cas par défaut : Le hackathon est ouvert/actif et disponible à l'inscription
      return {
        message: "Vous n'êtes pas encore inscrit à ce hackathon. Rejoignez l'aventure dès maintenant !",
        bannerClass: "bg-amber-50 border-amber-200 text-amber-800",
        iconClass: "text-amber-600",
        btnText: "S'inscrire au Hackathon",
        isDisabled: false,
      };
  }
})();

// Détermination de la configuration visuelle de la soumission selon le statut
const submissionConfig = (() => {
  const status = hackathon?.status?.toUpperCase();

  if (status === "CLOSED" || status === "FINISHED") {
    return {
      title: status === "CLOSED" ? "Soumissions clôturées" : "Hackathon terminé",
      description: status === "CLOSED" 
        ? "La période de dépôt des projets est désormais terminée. Il n'est plus possible d'envoyer ou de modifier vos livrables."
        : "Le hackathon est clos et les résultats ont été publiés. Les soumissions sont définitivement verrouillées.",
      iconClass: "bg-gray-100 text-gray-400",
      btnText: status === "CLOSED" ? "Dépôts fermés" : "Événement terminé",
      btnClass: "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none",
      isDisabled: true,
    };
  }

  // Cas par défaut : Le hackathon est en cours et ouvert aux dépôts
  return {
    title: "Prêt à soumettre vos travaux ?",
    description: "Vous pouvez soumettre ou modifier votre projet jusqu'à la date de clôture des dépôts.",
    iconClass: "bg-indigo-50 text-indigo-600",
    btnText: "Soumettre le projet",
    btnClass: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    isDisabled: false,
  };
})();

  useEffect(() => {
    loadPageData();
  }, [hackathonId]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-sm font-medium animate-pulse">
        Chargement de votre espace hackathon...
      </div>
    );
  }

  if (error || !hackathon) {
    return <div className="text-center py-20 text-red-600 font-medium">{error || "Hackathon introuvable."}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
      
      {/* RETOUR & TITRE BANNIÈRE */}
      <div className="space-y-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Voir tous les hackathons
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                {hackathon.title}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {hackathon.status}
              </span>
            </div>
          </div>
        </div>
      </div>

    {/* ================= SECTION VAINQUEURS AU TOP (PLEINE LARGEUR) ================= */}
            {hackathon.status?.toLowerCase() === "finished" && (
              <HackathonPodiumSection winners={hackathonWinners} />
            )}
            
      {/* DISPOSITION EN GRILLE (2/3 Infos Générales - 1/3 Statut et Actions du Participant) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLONNE GAUCHE : Informations Générales & Règles du Hackathon */}
        <div className="lg:col-span-2 space-y-6">
          <HackathonInfoSection hackathon={hackathon} />
          
          {/* SECTION DYNAMIQUE : ZONE DE SOUMISSION DE PROJET */}
            {isRegistered && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-lg font-bold text-gray-900">Votre projet / Livrable</h2>
                </div>
                
                <div className="p-6">
                  {!submission ? (
                    <div className="text-center py-6 space-y-4">
                        {/* Icône adaptative (Grise si fermé/fini, Indigo si ouvert) */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto transition-colors ${submissionConfig.iconClass}`}>
                          <Rocket className="w-6 h-6" />
                        </div>

                        <div className="max-w-md mx-auto space-y-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {submissionConfig.title}
                          </p>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {submissionConfig.description}
                          </p>
                        </div>

                        {/* Bouton actif ou désactivé selon le statut */}
                        <button
                          disabled={submissionConfig.isDisabled}
                          onClick={() => !submissionConfig.isDisabled && setIsSubmitModalOpen(true)}
                          className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${submissionConfig.btnClass}`}
                        >
                          {submissionConfig.btnText}
                        </button>
                      </div>
                      ) : (
                    <div className="space-y-4">
                      {/* Statut de validation */}
                      <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-emerald-900">Projet validé et soumis</h4>
                          <p className="text-xs text-emerald-700 mt-0.5">
                            Soumis le {new Date(submission.created_at).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      
                      {/* Contenu de la soumission */}
                      <div className="border border-gray-100 rounded-xl p-4 space-y-4 bg-gray-50/50">
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Nom du projet</label>
                          <p className="text-sm font-bold text-gray-900">{submission.title}</p>
                        </div>
                        
                        <div>
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Description</label>
                          <p className="text-xs text-gray-600 leading-relaxed">{submission.description}</p>
                        </div>
                        
                        {/* Grille des livrables et liens d'accès */}
                        <div className="space-y-2 pt-3 border-t border-gray-100">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Livrables et ressources</label>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* Lien GitHub */}
                            {submission.github_url && (
                              <a
                                href={submission.github_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:text-indigo-600 hover:border-indigo-100 shadow-sm transition-all group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <svg width="60px" height="60px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
    
                                      <title>github [#142]</title>
                                      <desc>Created with Sketch.</desc>
                                      <defs>

                                  </defs>
                                      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                          <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#000000">
                                              <g id="icons" transform="translate(56.000000, 160.000000)">
                                                  <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]">

                                  </path>
                                              </g>
                                          </g>
                                      </g>
                                  </svg>
                                  <span className="truncate">Dépôt GitHub</span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-600 shrink-0" />
                              </a>
                            )}

                            {/* Lien Figma */}
                            {submission.figma_url && (
                              <a
                                href={submission.figma_url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:text-pink-600 hover:border-pink-100 shadow-sm transition-all group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                    <svg width="60px" height="60px" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M138.537 49.8665C172.959 49.17 227.435 43.1506 262.348 47.6652C299.831 52.5121 301.114 79.4384 302.448 90.1082C304.855 109.366 296.297 132.183 278.892 142.128C264.387 150.417 156.261 153.222 141.481 148.999C86.2989 133.233 82.8564 58.4925 128.722 50.8483" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M206.969 177.688C212.884 165.473 224.194 155.428 237.97 153.309C299.928 143.776 320.814 201.088 288.534 233.368C251.302 270.601 202.154 236.018 202.154 190.028" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M132.656 153.331C98.3507 162.932 84.6589 221.794 116.434 242.978C139.77 258.535 170.439 253.223 196.689 253.223" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M139.057 253.65C113.61 261.284 99.4829 278.251 96.3685 303.169C90.1475 352.939 164.405 374.498 190.284 329.209C202.949 307.045 197.737 275.506 198.822 251.088C202.15 176.173 196.687 114.151 198.822 46.6096" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                  <span className="truncate">Maquette Figma</span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-pink-600 shrink-0" />
                              </a>
                            )}

                            {/* Lien Support de Présentation */}
                            {submission.presentation_path && (
                              <a
                                href={submission.presentation_path}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:text-amber-600 hover:border-amber-100 shadow-sm transition-all group sm:col-span-2"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span className="truncate">
                                    {submission.presentation_path.split("/").pop() || "Support de présentation"}
                                  </span>
                                </div>
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-600 shrink-0" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Boutons d'action en bas de carte */}
                      {/* On n'affiche le bouton QUE si le hackathon n'est NI fermé, NI terminé */}
                          {hackathon.status?.toUpperCase() !== "CLOSED" && hackathon.status?.toUpperCase() !== "FINISHED" && (
                            <div className="flex justify-end">
                              <button
                                onClick={() => setIsSubmitModalOpen(true)}
                                className="text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-2 bg-white hover:bg-gray-50 transition-colors"
                              >
                                Modifier la soumission
                              </button>
                            </div>
                          )}
                    </div>
                  )}  
                </div>
              </div>
            )}
        </div>

        {/* COLONNE DROITE : STATUT D'INSCRIPTION & INFOS ÉQUIPE */}
        <div className="space-y-6">
          
          {/* CARD STATUT DU PARTICIPANT */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider text-opacity-80">
              Votre participation
            </h3>

            {!isRegistered ? (
              /* CAS 1 : UTILISATEUR NON INSCRIT (DYNAMIQUE SELON LE STATUT) */
              <div className="space-y-4">
                <div className={`p-3 border rounded-xl flex items-start gap-2.5 ${registrationConfig.bannerClass}`}>
                  <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${registrationConfig.iconClass}`} />
                  <p className="text-xs leading-relaxed">
                    {registrationConfig.message}
                  </p>
                </div>
                
                <button
                  disabled={registrationConfig.isDisabled}
                  onClick={() => !registrationConfig.isDisabled && setIsRegisterModalOpen(true)}
                  className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all
                    ${registrationConfig.isDisabled 
                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none" 
                      : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                >
                  {registrationConfig.btnText}
                </button>
              </div>
            ) : (
              /* CAS 2 : DEJA INSCRIT */
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-900">Inscription confirmée</span>
                </div>

                {/* Détails de la structure de participation (Solo ou Équipe) */}
                  {userTeam ? (
                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                      
                      {/* EN-TÊTE : NOM DE L'ÉQUIPE + BOUTON DE CONFIGURATION */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-indigo-600 min-w-0">
                          <Users className="w-4 h-4 shrink-0" />
                          <span className="text-sm font-bold truncate">{userTeam.name}</span>
                        </div>
                        
                        {/* S'affiche uniquement si l'utilisateur connecté est le leader de l'équipe */}
                        {user?.id === userTeam.leader.id && (
                          <button
                            type="button"
                            onClick={() => setIsEditTeamModalOpen(true)}
                            className="p-1.5 inline-flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shadow-sm border border-gray-100 md:border-0 md:shadow-none"
                            title="Gérer l'équipe et les membres"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      
                      {/* LISTE DES MEMBRES */}
                      <div className="space-y-2 pt-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Coéquipiers :</p>
                        <ul className="space-y-1.5">
                          {userTeam.members.map((member) => (
                            <li key={member.id} className="text-xs text-gray-700 flex items-center justify-between gap-2">
                              <span className="truncate">
                                {member.first_name} {member.last_name || ""}
                              </span>
                              {member.id === userTeam.leader.id && (
                                <span className="text-[10px] bg-indigo-50 text-indigo-600 font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0">
                                  Leader
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                  <div className="border border-gray-100 rounded-xl p-4 text-center py-6">
                    <p className="text-sm font-medium text-gray-800">Participation en Solo</p>
                    <p className="text-xs text-gray-500 mt-1">Vous concourez individuellement pour ce hackathon.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BLOC INFOS RECOMPENSES / TIMELINE (Éléments bonus oubliés pertinents pour le participant) */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Prix & Dotations</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Consultez les prix mis en jeu par les organisateurs directement dans la description générale des lots. Les critères d'évaluation des jurys reposent sur l'innovation, la qualité technique et le pitch final.
            </p>
          </div>

        </div>
      </div>

      
     <SubmitProjectModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} existingSubmission={submission} onSuccess={loadPageData} hackathon_id={hackathon.id}/>
    


      <RegisterParticipantModal 
          isOpen={isRegisterModalOpen} 
          onClose={() => setIsRegisterModalOpen(false)} 
          hackathonId={hackathonId}
          onSuccess={loadPageData} // Déclenche le rechargement immédiat de la structure
          />  

      
        
          <EditTeamModal isOpen={isEditTeamModalOpen} onClose={() => setIsEditTeamModalOpen(false)} userTeam={userTeam} onSuccess={loadPageData} /> 
        
        

     </div>
  );

 

}