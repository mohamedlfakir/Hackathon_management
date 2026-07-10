import React, { useState, useEffect } from "react";
import { 
  Trophy, Rocket, Users, User, 
  ArrowUpRight, CheckCircle2, Clock, Star, Flame, Sparkles
} from "lucide-react";

import * as hackathonService from "../../../services/hackathon.service";
import { useNavigate } from "react-router-dom";

// ============================================================================
// INTERFACES DES DONNÉES (MOCK)
// ============================================================================
interface ActiveParticipation {
  id: number;
  title: string;
  participant_type: "SOLO" | "TEAM";
  team_name?: string;
  submission_status: "NOT_SUBMITTED" | "SUBMITTED";
  status: string;
  end_date: string;
  progress: number; // Pourcentage d'avancement du projet
  theme: string;
  project_title: string | null;

}

interface OpenHackathon {
  id: number;
  title: string;
  description: string;
  status: "OPEN" | "UPCOMING";
  prizePool: string;
  registrationDeadline: string;
  participantsCount: number;
  tags: string[];
}

interface PastParticipation {
  id: number;
  title: string;
  type: "SOLO" | "TEAM";
  team_name?: string;
  ranking: number;
  totalTeams: number;
  averageScore: number;
  project_title: string;
}

export default function ParticipantDashboard(): React.JSX.Element {
  // --------------------------------------------------------------------------
  // DONNÉES SIMULÉES (MOCK DATA CRÉATIVES)
  // --------------------------------------------------------------------------

  const navigate = useNavigate();

  const [myActiveParticipations, setMyActiveParticipations] = useState<ActiveParticipation[]>([]);

  const [upcomingHackathons, setUpcomingHackathons] = useState<OpenHackathon[]>([]);

  const [openHackathons, setOpenHackathons] = useState<OpenHackathon[]>([]);

  const [pastParticipations, setPastParticipations] = useState<PastParticipation[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const loadPageData = async () => {
      
    setLoading(true);
    setError(null);
      
        try {
          const [UpcomingHackathonsData, activeParticipationsData, openHackathonsData, pastParticipationsData] = await Promise.all([
            hackathonService.getUpcomingHackathons(),
            hackathonService.getMyActiveHackathons(),
            hackathonService.getActiveHackathons(),
            hackathonService.getMyFinishedHackathons()
          ]);

          //setActiveParticipations(activeParticipationsData?.hackathons);
          setMyActiveParticipations(activeParticipationsData?.hackathons);
          setUpcomingHackathons(UpcomingHackathonsData?.hackathons);
          setOpenHackathons(openHackathonsData.hackathons);
          setPastParticipations(pastParticipationsData.hackathons);
        } catch (err) {
          console.error("Erreur de chargement de la page Hackathon (Juge):", err);
          setError("Une erreur est survenue lors de la récupération des données du hackathon.");
        } finally {
          setLoading(false);
        }
          
        
    }
    useEffect(() => {
            loadPageData();
          },[]);



  // --------------------------------------------------------------------------
  // LOGIQUE DE DICTIONNAIRE ET CONFIGURATION DES ETATS
  // --------------------------------------------------------------------------
  const getSubmissionBadge = (status: ActiveParticipation["submission_status"]) => {
    switch (status) {
      case "SUBMITTED":
        return { text: "Projet Soumis", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      default:
        return { text: "Projet pas Soumis", classes: "bg-gray-50 text-red-500 border-red-200" };
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { medal: "🥇", text: "1er Place", bg: "bg-amber-50 border-amber-200 text-amber-800" };
      case 2:
        return { medal: "🥈", text: "2ème Place", bg: "bg-slate-50 border-slate-300 text-slate-800" };
      case 3:
        return { medal: "🥉", text: "3ème Place", bg: "bg-orange-50 border-orange-200 text-orange-800" };
      default:
        return { medal: "🎯", text: `${rank}e / `, bg: "bg-gray-50 border-gray-200 text-gray-600" };
    }
  };

  function getDaysLeft(dateString: string): number {
      const today = new Date();
      const endDate = new Date(dateString);

      // Ignore the time portion
      today.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      const diff = endDate.getTime() - today.getTime();

      return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

    if (loading) {
    return <div className="text-center py-20 text-gray-500 text-sm font-medium animate-pulse">Chargement de votre espace ...</div>;
  }
  
  if (error) {
    return <div className="text-center py-20 text-red-600 font-medium">{error || "Une erreur est survenue."}</div>;
  }


  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 px-4 md:px-6">
      
      {/* 1. EN-TÊTE BIENVENUE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-40 h-40" />
        </div>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              Espace Participant
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Ravi de vous revoir, Hacker ! 👋
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Prêt à concevoir le futur ? Suivez vos livrables actifs, explorez de nouveaux défis technologiques et gérez vos récompenses.
          </p>
        </div>
        
        {/* STATS RAPIDES COMPACTES */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 shrink-0 z-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center min-w-[90px]">
            <Flame className="w-5 h-5 mx-auto text-orange-400 mb-1" />
            <div className="text-lg font-black">2</div>
            <div className="text-[10px] text-gray-400">Actifs</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center min-w-[90px]">
            <Trophy className="w-5 h-5 mx-auto text-amber-400 mb-1" />
            <div className="text-lg font-black">2</div>
            <div className="text-[10px] text-gray-400">Podiums</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center min-w-[90px]">
            <CheckCircle2 className="w-5 h-5 mx-auto text-indigo-400 mb-1" />
            <div className="text-lg font-black">3</div>
            <div className="text-[10px] text-gray-400">Terminés</div>
          </div>
        </div>
      </div>

      {/* DISPOSITION PRINCIPALE SUR 3 COLONNES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ================= GAUCHE / CENTRE : EN COURS ET RECHERCHE (2/3) ================= */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* SECTION : PARTICIPATIONS EN COURS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">Mes Participations en Cours</h2>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full font-bold">
                  {myActiveParticipations.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {myActiveParticipations.length === 0 ? (
    /* État Vide : S'affiche si le tableau est égal à [] */
    <div className="col-span-1 md:col-span-2 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
      <p className="text-sm font-medium text-gray-600">
        Vous n'avez participer a aucun hackathon en cours pour le moment.
      </p>
      <p className="text-xs text-gray-400 mt-1 mb-4">
        Rejoignez une équipe ou lancez-vous en solo sur l'un des défis disponibles !
      </p>
    </div>
  ) : (
    /* Votre boucle Map existante : S'affiche s'il y a des projets */
    myActiveParticipations.map((project) => {
      const badge = getSubmissionBadge(project.submission_status);
      return (
        <div key={project.id} onClick={() => navigate(`/myspace/hackathons/${project.id}`)} className="bg-white cursor-pointer rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {project.theme}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${badge.classes}`}>
                {badge.text}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-base line-clamp-1">
              {project.title}
            </h3>
            
            {/* Badge Solo / Équipe */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
              {project.participant_type === "TEAM" ? (
                <>
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium">Équipe : <strong className="text-gray-700">{project.team_name}</strong></span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium text-gray-600">Participation Solo</span>
                </>
              )}
            </div>
          </div>

          {/* Section Progression & Jours restants */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${project.progress === 100 ? "bg-emerald-500" : "bg-indigo-600"}`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between pt-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                ⏳ { getDaysLeft(project.end_date) }  Jours restantes 
              </span>
              <button className="inline-flex items-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                Gérer mon projet <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
            <div> 
               <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        project.status === "OPEN" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}>
                        {project.status === "OPEN" ? "INSCRIPTIONS OUVERTES" : "SOUMISSIONS FERME"}
                      </span>
            </div>
          </div>
        </div>
      );
    })
  )}
</div>
</div>
          {/* SECTION : EXPLORER / COMPÉTITIONS OUVERTES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-bold text-gray-900">Hackathons Ouverts à l'Inscription</h2>
              </div>
            </div>

            <div className="space-y-4">
              {([...(upcomingHackathons),
            ...(openHackathons) ]).map((hack) => (
                <div key={hack.id} onClick={() => navigate(`/myspace/hackathons/${hack.id}`)} className="bg-white rounded-xl border cursor-pointer border-gray-200 p-5 shadow-sm hover:border-gray-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-gray-900 text-base tracking-tight">
                     {hack.title}
                      </h3>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        hack.status === "OPEN" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {hack.status === "OPEN" ? "INSCRIPTIONS OUVERTES" : "BIENTÔT DISPONIBLE"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {hack.description}
                    </p>
                  
                  </div>

                  {/* Boutons et métriques financiers à droite */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-dashed border-gray-100 gap-2">
                    <div className="text-left md:text-right">
                      <div className="text-[10px] text-gray-400 font-medium uppercase">Cashprize</div>
                      <div className="text-base font-black text-indigo-600">{hack.prizePool}</div>
                    </div>
                    <button 
                      disabled={hack.status === "UPCOMING"}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                        hack.status === "UPCOMING"
                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {hack.status === "UPCOMING" ? "Alerte Ouverture" : "Rejoindre l'aventure"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ================= DROITE : HISTORIQUE ET CLASSEMENTS (1/3) ================= */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* EN-TÊTE DU PALMARÈS */}
            <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-gray-900 text-sm">Mon Palmarès Final</h3>
              </div>
              <span className="text-[11px] font-medium text-gray-400">
                {pastParticipations.length} clôturés
              </span>
            </div>

            {/* LISTE DES RANGS PASSÉS */}
            <div className="divide-y divide-gray-100 max-h-[460px] overflow-y-auto">
              {pastParticipations.map((past) => {
                const badgeConfig = getRankBadge(past.ranking);
                return (
                  <div key={past.id} onClick={() => navigate(`/myspace/hackathons/${past.id}`)} className="p-4 hover:bg-gray-50/50 transition-colors space-y-2 cursor-pointer">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                          {past.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 truncate font-medium">
                          Projet : <span className="text-gray-600 italic">« {past.project_title} »</span>
                        </p>
                      </div>
                      
                      {/* Badge du classement */}
                      <span className={`inline-flex items-center gap-0.5 text-[11px] font-black px-2 py-0.5 rounded-md border shrink-0 shadow-sm ${badgeConfig.bg}`}>
                        <span>{badgeConfig.medal}</span>
                        <span>{badgeConfig.text}</span>
                        {past.ranking > 3 && <span className="font-bold text-[10px] text-gray-400">{past.totalTeams}</span>}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-medium text-gray-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        {past.type === "TEAM" ? (
                          <><Users className="w-3 h-3 text-emerald-500" /> {past.team_name}</>
                        ) : (
                          <><User className="w-3 h-3 text-blue-500" /> Solo</>
                        )}
                      </span>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PETIT ENCART DE CERTIFICATION CONSEIL */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/80 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider">
              <Star className="w-4 h-4 text-indigo-600 fill-indigo-100" /> Badge d'Expérience
            </div>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed">
              Chaque podium débloque des points d'expertise sur votre profil public. Continuez à soumettre des projets de qualité pour attirer l'œil des recruteurs !
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}