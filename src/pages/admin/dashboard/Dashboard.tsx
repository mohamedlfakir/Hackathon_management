import React, { useState, useEffect } from "react";
import { 
  Trophy, Rocket, Users, User, ArrowUpRight, 
  CheckCircle2, Clock, Star, Flame, Sparkles, 
  Shield, Briefcase, ChevronLeft, ChevronRight, AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as hackathonService from "../../../services/hackathon.service";

// ============================================================================
// INTERFACES DES DONNÉES
// ============================================================================
interface AdminStats {
  total_users: string;
  total_hackathons: string;
  total_submissions: string;
  total_teams: string;
  total_participants: string;
  total_organizers: string;
  total_judges: string;
  total_admins: string;
  upcoming_hackathons: string;
  active_hackathons: string;
  finished_hackathons: string;
}

interface AdminHackathon {
  id: number;
  title: string;
  description: string;
  status: "UPCOMING" | "OPEN" | "CLOSED" | "FINISHED";
  prizePool: string;
  registrationDeadline: string;
  participantsCount: number;
  teamsCount?: number;
  theme?: string;
}

export default function AdminDashboard(): React.JSX.Element {
  const navigate = useNavigate();

  // --- ÉTATS DES DONNÉES ---
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [upcomingHackathons, setUpcomingHackathons] = useState<AdminHackathon[]>([]);
  const [openHackathons, setOpenHackathons] = useState<AdminHackathon[]>([]);
  const [closedHackathons, setClosedHackathons] = useState<AdminHackathon[]>([]);
  const [finishedHackathons, setFinishedHackathons] = useState<AdminHackathon[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- ÉTAT DU SLIDER DE STATISTIQUES ---
  const [statsIndex, setStatsIndex] = useState(0);
  const statsPerPage = 4;

  // --- CHARGEMENT DES DONNÉES DEPUIS L'API ---
  const loadPageData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulation ou récupération réelle via vos services admin
      const [statsRes, upcomingRes, openRes, closedRes, finishedRes] = await Promise.all([
        hackathonService.getDashboardStatistics?.() || Promise.resolve({
          total_users: "5", total_hackathons: "4", total_submissions: "3", total_teams: "3",
          total_participants: "2", total_organizers: "1", total_judges: "1", total_admins: "1",
          upcoming_hackathons: "1", active_hackathons: "2", finished_hackathons: "1"
        }),
        hackathonService.getUpcomingHackathons(),
        hackathonService.getActiveHackathons(),
        hackathonService.getActiveHackathons?.() || Promise.resolve({ hackathons: [] }),
        hackathonService.getActiveHackathons()
      ]);

      setStats(statsRes);
      setUpcomingHackathons(upcomingRes?.hackathons || []);
      setOpenHackathons(openRes?.hackathons || []);
      setClosedHackathons(closedRes?.hackathons || []);
      setFinishedHackathons(finishedRes?.hackathons || []);
    } catch (err) {
      console.error("Erreur de chargement du tableau de bord admin :", err);
      setError("Une erreur est survenue lors de la récupération des métriques d'administration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-sm font-medium animate-pulse">Chargement de la console d'administration ...</div>;
  }

  if (error || !stats) {
    return <div className="text-center py-20 text-red-600 font-medium">{error || "Une erreur est survenue."}</div>;
  }

  // --- DICTIONNAIRE DES STATISTIQUES (ICÔNES ET LABELS) ---
  const statsConfig: Record<keyof AdminStats, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
    total_users: { label: "Utilisateurs globaux", icon: <Users className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
    total_hackathons: { label: "Hackathons créés", icon: <Rocket className="w-5 h-5" />, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
    total_submissions: { label: "Projets soumis", icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
    total_teams: { label: "Équipes formées", icon: <Briefcase className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-50 border-purple-100" },
    total_participants: { label: "Participants uniques", icon: <User className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-50 border-orange-100" },
    total_organizers: { label: "Organisateurs", icon: <Sparkles className="w-5 h-5" />, color: "text-pink-600", bg: "bg-pink-50 border-pink-100" },
    total_judges: { label: "Juges assignés", icon: <Star className="w-5 h-5" />, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
    total_admins: { label: "Administrateurs", icon: <Shield className="w-5 h-5" />, color: "text-slate-700", bg: "bg-slate-100 border-slate-200" },
    upcoming_hackathons: { label: "Événements à venir", icon: <Clock className="w-5 h-5" />, color: "text-cyan-600", bg: "bg-cyan-50 border-cyan-100" },
    active_hackathons: { label: "Événements actifs", icon: <Flame className="w-5 h-5" />, color: "text-rose-600", bg: "bg-rose-50 border-rose-100" },
    finished_hackathons: { label: "Événements clôturés", icon: <Trophy className="w-5 h-5" />, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
  };

  const statsArray = Object.entries(stats).map(([key, value]) => ({
    key: key as keyof AdminStats,
    value,
    ...statsConfig[key as keyof AdminStats]
  }));

  const nextStats = () => {
    if (statsIndex < statsArray.length - statsPerPage) setStatsIndex(prev => prev + 1);
  };
  const prevStats = () => {
    if (statsIndex > 0) setStatsIndex(prev => prev - 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16 px-4 md:px-6">
      
      {/* 1. HEADER BANNER (Identique au style Participant) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shield className="w-40 h-40" />
        </div>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-rose-500/20 text-rose-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
              Console SuperAdmin
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Vue d'ensemble de la Plateforme
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Pilotez l'ensemble de l'écosystème. Suivez les inscriptions des utilisateurs, validez les soumissions et gérez le cycle de vie de chaque compétition.
          </p>
        </div>
      </div>

      {/* 2. SECTION CARROUSEL DES STATISTIQUES */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Indicateurs Clés Globaux</h2>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={prevStats}
              disabled={statsIndex === 0}
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button 
              onClick={nextStats}
              disabled={statsIndex >= statsArray.length - statsPerPage}
              className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out space-x-4"
            style={{ transform: `translateX(-${statsIndex * (100 / statsPerPage)}%)` }}
          >
            {statsArray.map((stat) => (
              <div 
                key={stat.key} 
                className={`w-[calc(25%-12px)] flex-shrink-0 border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 ${stat.bg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 line-clamp-1">
                    {stat.label}
                  </span>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. LISTES ROULANTES DES COMPÉTITIONS */}
      <div className="space-y-10">
        <AdminHackathonSectionRow title="Upcoming Hackathons" hackathons={upcomingHackathons} defaultBadgeColor="bg-blue-100 text-blue-800" navigate={navigate} />
        <AdminHackathonSectionRow title="Open Hackathons" hackathons={openHackathons} defaultBadgeColor="bg-emerald-100 text-emerald-800" navigate={navigate} />
        <AdminHackathonSectionRow title="Closed Hackathons" hackathons={closedHackathons} defaultBadgeColor="bg-orange-100 text-orange-800" navigate={navigate} />
        <AdminHackathonSectionRow title="Finished Hackathons" hackathons={finishedHackathons} defaultBadgeColor="bg-gray-100 text-gray-800" navigate={navigate} />
      </div>

    </div>
  );
}

// ============================================================================
// SOUS-COMPOSANT DE CARROUSEL HACKATHON UNIQUE ET RÉUTILISABLE
// ============================================================================
interface SectionRowProps {
  title: string;
  hackathons: AdminHackathon[];
  defaultBadgeColor: string;
  navigate: (path: string) => void;
}

const AdminHackathonSectionRow: React.FC<SectionRowProps> = ({ title, hackathons, defaultBadgeColor, navigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 4;

  const nextCard = () => {
    if (currentIndex < hackathons.length - cardsToShow) setCurrentIndex(prev => prev + 1);
  };
  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {hackathons.length}
          </span>
        </div>
        
        {hackathons.length > cardsToShow && (
          <div className="flex space-x-2">
            <button 
              onClick={prevCard}
              disabled={currentIndex === 0}
              className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button 
              onClick={nextCard}
              disabled={currentIndex >= hackathons.length - cardsToShow}
              className="p-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden w-full">
        {hackathons.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50/50">
            <div className="flex justify-center mb-1 text-gray-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-gray-600">Aucun hackathon trouvé pour le moment.</p>
          </div>
        ) : (
          <div 
            className="flex transition-transform duration-300 ease-in-out space-x-4"
            style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
          >
            {hackathons.map((hack) => (
              <div 
                key={hack.id} 
                onClick={() => navigate(`/myspace/hackathons/${hack.id}`)} 
                className="w-[calc(25%-12px)] flex-shrink-0 bg-white cursor-pointer rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate max-w-[100px]">
                      {hack.theme || "GÉNÉRAL"}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${defaultBadgeColor}`}>
                      {hack.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                    {hack.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {hack.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-[11px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      {hack.participantsCount || 0} Part.
                    </span>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                      {hack.prizePool}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-medium text-gray-400 truncate max-w-[110px]">
                      📅 {hack.registrationDeadline}
                    </span>
                    <button className="inline-flex items-center text-xs font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                      Gérer <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};