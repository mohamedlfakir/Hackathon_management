import React, { useState, useEffect } from "react";
import { 
  Trophy, Clock, CheckCircle2, Award, ArrowUpRight, 
   ExternalLink, FileText, Users, User, AlertCircle, Sparkles,
   GitBranch
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as hackathonService from "../../../services/hackathon.service";
import * as evaluationService from "../../../services/evaluation.service"; // Exemple de chemin d'accès à vos services

// ============================================================================
// INTERFACES DES DONNÉES
// ============================================================================
interface PendingSubmission {
  id: number;
  title: string;
  description: string;
  github_url: string | null;
  figma_url: string | null;
  presentation_path: string | null;
  submitted_at: string;
  hackathon_id: number;
  hackathon_title: string;
  participant_type: "TEAM" | "SOLO";
  team_id: number | null;
  team_name: string | null;
  user_id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

interface AssignedHackathon {
  id: number;
  title: string;
  description: string;
  status: "UPCOMING" | "OPEN" | "CLOSED" | "FINISHED";
  prizePool: string;
  registrationDeadline: string;
  participantsCount: number;
  theme?: string;
}

export default function JudgeDashboard(): React.JSX.Element {
  const navigate = useNavigate();

  // --- ÉTATS ---
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>([]);
  const [assignedHackathons, setAssignedHackathons] = useState<AssignedHackathon[]>([]);
  
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [evaluatedCount, setEvaluatedCount] = useState<number>(0);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- CHARGEMENT DES DONNÉES ---
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pendingRes, pendingCountRes, evaluatedCountRes, hackathonsRes] = await Promise.all([
        evaluationService.getMyPendingSubmissions(),
        evaluationService.getMyPendingSubmissionsCount(),
        evaluationService.getMyEvaluatedSubmissionsCount(),
        hackathonService.getMyAssignedHackathons?.() || Promise.resolve({ hackathons: [] }) 
        // Note: Ajustez la méthode d'appel selon vos signatures exactes de services
      ]);

      setPendingSubmissions(pendingRes || []);
      setPendingCount(pendingCountRes?.total || 0);
      setEvaluatedCount(evaluatedCountRes?.total || 0);
      
      // Filtrer pour exclure les hackathons terminés ('FINISHED') si nécessaire
      const activeAssigned = (hackathonsRes?.hackathons || []).filter(
        (h: AssignedHackathon) => h.status !== "FINISHED"
      );
      setAssignedHackathons(activeAssigned);

    } catch (err) {
      console.error("Erreur lors de la récupération des données du jury :", err);
      setError("Impossible de charger les données de votre espace de notation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500 text-sm font-medium animate-pulse">Chargement de votre espace de jury...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600 font-medium">{error}</div>;
  }

  // Calcul du taux de complétion de la notation
  const totalAllocated = pendingCount + evaluatedCount;
  const evaluationProgress = totalAllocated > 0 ? Math.round((evaluatedCount / totalAllocated) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-16 px-4 md:px-6">
      
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-40 h-40" />
        </div>
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Espace Membre du Jury
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Évaluez et Propulsez l'Innovation 🚀
          </h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Consultez les livrables, testez les prototypes de code et attribuez vos scores pour départager les meilleurs projets de la plateforme.
          </p>
        </div>
      </div>

      {/* 2. LES 4 INDICATEURS CLÉS (KPI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 : En attente */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Projets à évaluer</span>
            <div className="text-orange-600 bg-orange-50 p-1.5 rounded-lg border border-orange-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{pendingCount}</p>
        </div>

        {/* KPI 2 : Évalués */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Projets notés</span>
            <div className="text-emerald-600 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{evaluatedCount}</p>
        </div>

        {/* KPI 3 : Progression globale */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Progression globale</span>
            <div className="text-blue-600 bg-blue-50 p-1.5 rounded-lg border border-blue-100">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-gray-900 tracking-tight">{evaluationProgress}%</p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-600 h-1.5 transition-all duration-500" style={{ width: `${evaluationProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* KPI 4 : Hackathons affectés */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Hackathons Actifs</span>
            <div className="text-purple-600 bg-purple-50 p-1.5 rounded-lg border border-purple-100">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 tracking-tight">{assignedHackathons.length}</p>
        </div>

      </div>

      {/* 3. LISTE DES HACKATHONS ASSIGNÉS EN COURS */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Vos Compétitions Assignées</h2>
          <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {assignedHackathons.length} en cours
          </span>
        </div>

        {assignedHackathons.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center bg-gray-50/50">
            <p className="text-sm font-medium text-gray-500">Aucun hackathon actif ne vous est assigné actuellement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {assignedHackathons.map((hack) => (
              <div 
                key={hack.id} 
                onClick={() => navigate(`/myspace/hackathons/${hack.id}`)} 
                className="bg-white cursor-pointer rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 truncate">
                      {hack.theme || "GÉNÉRAL"}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {hack.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base line-clamp-1">{hack.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{hack.description}</p>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center text-[11px] text-gray-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Users className="w-3.5 h-3.5 text-indigo-500" />
                      {hack.participantsCount || 0} Part.
                    </span>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded">
                      {hack.prizePool}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-400 font-medium">
                      📅 {new Date(hack.registrationDeadline).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="inline-flex items-center text-xs font-bold text-gray-900 hover:text-indigo-600">
                      Ouvrir <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. LISTE DES SOUMISSIONS NON ENCORE ÉVALUÉES */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-gray-900">Soumissions en attente de notation</h2>
          <span className="bg-orange-50 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">
            {pendingSubmissions.length} projets restants
          </span>
        </div>

        {pendingSubmissions.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center bg-gray-50/50">
            <div className="flex justify-center mb-2 text-emerald-500">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-800">Beau travail !</p>
            <p className="text-xs text-gray-500 mt-0.5">Toutes les soumissions assignées ont été évaluées.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSubmissions.map((submission) => (
              <div 
                key={submission.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-gray-300 transition-colors"
              >
                {/* Header du projet */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {submission.hackathon_title}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mt-1">{submission.title}</h3>
                    </div>
                    
                    {/* Badge d'équipe ou solo */}
                    <div className="flex-shrink-0">
                      {submission.participant_type === "TEAM" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md border border-purple-100">
                          <Users className="w-3.5 h-3.5" /> {submission.team_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-100">
                          <User className="w-3.5 h-3.5" /> {submission.first_name} {submission.last_name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {submission.description}
                  </p>
                </div>

                {/* Liens vers les livrables techniques */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                  {submission.github_url && (
                    <a 
                      href={submission.github_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <GitBranch className="w-3.5 h-3.5" /> Code Repo
                    </a>
                  )}
                  {submission.figma_url && (
                    <a 
                      href={submission.figma_url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Prototype Figma
                    </a>
                  )}
                  {submission.presentation_path && (
                    <a 
                      href={submission.presentation_path} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 hover:bg-gray-100 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> Présentation
                    </a>
                  )}
                </div>

                {/* Footer de la carte soumission */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-[10px] text-gray-400 font-medium">
                    Soumis le : {new Date(submission.submitted_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  
                  <button 
                    onClick={() => navigate(`/myspace/evaluations/${submission.id}/rate`)}
                    className="inline-flex items-center justify-center bg-gray-900 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors group"
                  >
                    Noter le projet
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}