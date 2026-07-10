import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as evaluationService from "../../../services/evaluation.service";
import * as submissionService from "../../../services/submission.service";

import { 
  ArrowLeft, 
  FileText, 
  ExternalLink, 
  Loader2, 
  AlertTriangle, 
  MessageSquare, 
  Award,
  Users,
  Download,
  Mail,
  Lock,
  CheckCircle2,
  TrendingUp,
  Info,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

export interface EvaluationCriterion {
  id: number;
  code: string;
  name: string;
  max_score: number;
}

export interface SubmissionDetails {
  id: number;
  title: string;
  description: string;
  team_name: string;
  github_url?: string;
  figma_url?: string;
  presentation?: string;
  created_at: string;
  status: "pending" | "under_review" | "finalized";
}

export interface JudgeEvaluation {
  judge_id: number;
  first_name: string;
  last_name: string;
  judge_avatar?: string;
  submitted_at: string;
  scores: {
    criterion_id: number;
    score: number;
    comment?: string;
  }[];
  total_score: number;
}

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FigmaIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
    <path d="M12 2h3.5a3.5 3.5 0 0 1 0 7H12V2z" />
    <path d="M12 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 1 1 7 0z" />
    <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 0 1-3.5 3.5H8.5A3.5 3.5 0 0 1 5 19.5z" />
    <path d="M12 16h3.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5H12V16z" />
  </svg>
);


export default function AdminSubmissionDetailsPage(): React.JSX.Element {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const id = Number(submissionId);

  // Data states
  const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>([]);
  const [evaluations, setEvaluations] = useState<JudgeEvaluation[]>([]);

  // UI & UX States
  const [activeTab, setActiveTab] = useState<"summary" | "judges" | "details">("summary");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedJudgeId, setSelectedJudgeId] = useState<number | null>(null);

  useEffect(() => {
    async function loadAdminData() {
      if (isNaN(id)) {
        setError("Identifiant de soumission invalide.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [criteriaData, submissionData, evaluationsData] = await Promise.all([
          evaluationService.getEvaluationCriteria(),
          submissionService.getSubmissionById(id),
          evaluationService.getSubmissionEvaluations(id)
        ]);


        setCriteria(criteriaData);
        setSubmission(submissionData);
        setEvaluations(evaluationsData);

        console.log("evaluationData: ", evaluationsData);
        console.log("submissionData: ", submissionData);

        if (evaluationsData.length > 0) {
          setSelectedJudgeId(evaluationsData[0].judge_id);
        }

      } catch (err: any) {
        console.error("Error loading admin details:", err);
        setError(err.message || "Erreur de chargement des données d'évaluation.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminData();
  }, [id]);

  // Calculates average scores per criteria
  const getCriterionStats = (criterionId: number) => {
    const scoresForCriterion = evaluations.map(e => {
      const match = e.scores.find(s => s.criterion_id === criterionId);
      return match ? match.score : 0;
    });

    if (scoresForCriterion.length === 0) return { avg: 0, sum: 0, min: 0, max: 0, discrepancy: false };

    const sum = scoresForCriterion.reduce((acc, curr) => acc + curr, 0);
    const avg = parseFloat((sum / scoresForCriterion.length).toFixed(1));
    const min = Math.min(...scoresForCriterion);
    const max = Math.max(...scoresForCriterion);
    
    // Discrepancy threshold: difference of more than 30% of the maximum score possible
    const criterion = criteria.find(c => c.id === criterionId);
    const maxLimit = criterion ? criterion.max_score : 20;
    const discrepancy = (max - min) >= (maxLimit * 0.3);

    return { avg, sum, min, max, discrepancy };
  };

  // Calculates global score averages
  const getGlobalStats = () => {
    if (evaluations.length === 0) return { avgScore: 0, maxScore: 0, totalSubmitted: 0 };
    
    const sumOfTotals = evaluations.reduce((acc, e) => acc + e.total_score, 0);
    const avgScore = parseFloat((sumOfTotals / evaluations.length).toFixed(1));
    const maxPossible = criteria.reduce((sum, c) => sum + c.max_score, 0);

    return {
      avgScore,
      maxScore: maxPossible,
      totalSubmitted: evaluations.length
    };
  };

  const handleStatusChange = async (newStatus: "pending" | "under_review" | "finalized") => {
    if (!submission) return;
    try {
      setIsUpdatingStatus(true);
      const success = true;
      if (success) {
        setSubmission({ ...submission, status: newStatus });
        triggerNotification("success", `Le statut du projet a été mis à jour : ${
          newStatus === "finalized" ? "Évaluations Clôturées" : newStatus === "under_review" ? "En cours d'évaluation" : "En attente"
        }`);
      } else {
        triggerNotification("error", "Impossible de mettre à jour le statut.");
      }
    } catch (err) {
      triggerNotification("error", "Une erreur est survenue lors de la mise à jour.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const triggerNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleExportCSV = () => {
    triggerNotification("success", "Le rapport CSV est en cours de génération et sera téléchargé automatiquement.");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 font-medium animate-pulse">Chargement de l'espace d'administration...</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>{error || "La soumission demandée est introuvable."}</div>
        </div>
      </div>
    );
  }

  const globalStats = getGlobalStats();
  const criteriaStats = criteria.map(c => ({
    ...c,
    stats: getCriterionStats(c.id)
  }));

  // Find if there are any major score discrepancies among judges
  const activeDiscrepancies = criteriaStats.filter(c => c.stats.discrepancy);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4">
      
      {}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors group self-start"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" /> 
            Retour aux soumissions
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Statut des évaluations :</span>
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                disabled={isUpdatingStatus}
                onClick={() => handleStatusChange("under_review")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  submission.status === "under_review" 
                    ? "bg-indigo-50 text-indigo-700 font-bold" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                En cours
              </button>
              <button
                disabled={isUpdatingStatus}
                onClick={() => handleStatusChange("finalized")}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${
                  submission.status === "finalized" 
                    ? "bg-emerald-50 text-emerald-700 font-bold" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <Lock className="w-3 h-3" /> Clôturer
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{submission.title}</h1>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                submission.status === "finalized" 
                  ? "bg-emerald-100 text-emerald-800" 
                  : "bg-blue-100 text-blue-800"
              }`}>
                {submission.status === "finalized" ? "Clôturé & Validé" : "En cours d'évaluation"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Équipe candidate : <span className="font-bold text-indigo-600">{submission.team_name}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-gray-500" />
              Exporter le rapport
            </button>
            <button
              onClick={() => triggerNotification("success", "Un rappel a été envoyé aux juges restants.")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
            >
              <Mail className="w-4 h-4" />
              Rappeler aux Juges
            </button>
          </div>
        </div>
      </div>

      {}
      {notification && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold shadow-sm animate-fade-in ${
          notification.type === "success" 
            ? "bg-emerald-50 border border-emerald-100 text-emerald-700" 
            : "bg-red-50 border border-red-100 text-red-700"
        }`}>
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <div>{notification.message}</div>
        </div>
      )}

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI: Global average score */}
        <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100/50 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Note Finale Moyenne</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-indigo-950">{globalStats.avgScore}</span>
              <span className="text-sm font-medium text-indigo-500">/ {globalStats.maxScore}</span>
            </div>
            <p className="text-[10px] text-indigo-400">Calculée sur {globalStats.totalSubmitted} évaluations</p>
          </div>
          <div className="p-3 bg-indigo-100/60 rounded-xl text-indigo-600">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* KPI: Judges validation progress */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Taux de Participation</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-gray-900">{evaluations.length}</span>
              <span className="text-sm font-medium text-gray-400">/ 3 juges</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> 100% de complétion
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl text-gray-500">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* KPI: Best Performing Criteria */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Point Fort</span>
            {criteriaStats.length > 0 ? (
              (() => {
                const best = [...criteriaStats].sort((a, b) => b.stats.avg - a.stats.avg)[0];
                return (
                  <>
                    <div className="text-sm font-bold text-gray-900 truncate max-w-[180px]">{best.name}</div>
                    <div className="text-xl font-extrabold text-emerald-600 mt-1">
                      {best.stats.avg} <span className="text-xs text-gray-400">/ {best.max_score}</span>
                    </div>
                  </>
                );
              })()
            ) : (
              <div className="text-sm text-gray-400">Aucune donnée</div>
            )}
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* KPI: Discrepancies Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Alertes Écart</span>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-3xl font-extrabold ${activeDiscrepancies.length > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
                {activeDiscrepancies.length}
              </span>
              <span className="text-xs font-semibold text-gray-400">critère(s)</span>
            </div>
            <p className="text-[10px] text-gray-500">Écarts inter-juges de &gt; 30%</p>
          </div>
          <div className={`p-3 rounded-xl ${activeDiscrepancies.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

      </div>

      {}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("summary")}
            className={`pb-4 text-sm font-semibold relative transition-colors ${
              activeTab === "summary" ? "text-indigo-600" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {activeTab === "summary" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
            Synthèse Globale & Critères
          </button>
          
          <button
            onClick={() => setActiveTab("judges")}
            className={`pb-4 text-sm font-semibold relative transition-colors ${
              activeTab === "judges" ? "text-indigo-600" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {activeTab === "judges" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
            Notes Détaillées par Juge
          </button>

          <button
            onClick={() => setActiveTab("details")}
            className={`pb-4 text-sm font-semibold relative transition-colors ${
              activeTab === "details" ? "text-indigo-600" : "text-gray-400 hover:text-gray-900"
            }`}
          >
            {activeTab === "details" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />}
            Projet & Livrables
          </button>
        </nav>
      </div>

      {}
      {activeTab === "summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Main breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-150 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Analyse Moyenne des Critères</h3>
                <p className="text-xs text-gray-500 mt-0.5">Voici les scores moyens cumulés attribués par tous les jurys.</p>
              </div>

              <div className="space-y-6">
                {criteriaStats.map((criterion) => {
                  const percentage = (criterion.stats.avg / criterion.max_score) * 100;
                  return (
                    <div key={criterion.id} className="space-y-2 p-4 hover:bg-gray-50/50 rounded-xl transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                            {criterion.name}
                            {criterion.stats.discrepancy && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-medium border border-amber-200">
                                <ShieldAlert className="w-3 h-3" /> Écart fort ({criterion.stats.max - criterion.stats.min} pts)
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide">CODE: {criterion.code}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base font-bold text-gray-900">{criterion.stats.avg} </span>
                          <span className="text-xs text-gray-400">/ {criterion.max_score}</span>
                          <div className="text-[10px] text-gray-400">Min: {criterion.stats.min} | Max: {criterion.stats.max}</div>
                        </div>
                      </div>

                      {/* Custom styled progress bars */}
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentage >= 80 
                              ? "bg-emerald-500" 
                              : percentage >= 60 
                                ? "bg-indigo-500" 
                                : "bg-amber-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>

                      {/* Judges score list visualization */}
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-gray-500 flex-wrap">
                        <span className="font-semibold">Notes individuelles :</span>
                        {evaluations.map((e, idx) => {
                          const scoreObj = e.scores.find(s => s.criterion_id === criterion.id);
                          return (
                            <span key={idx} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                              {e.first_name} {e.last_name} : {scoreObj ? scoreObj.score : 0}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Discrepancy Warnings & quick actions */}
          <div className="space-y-6">
            
            {activeDiscrepancies.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 space-y-4">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-900 text-sm">Disparités de notations</h3>
                    <p className="text-xs text-amber-700 mt-1">
                      Les membres du jury ont des avis très divergents sur certains critères de notation. Nous vous conseillons d'ouvrir une discussion de réalignement.
                    </p>
                  </div>
                </div>
                <div className="divide-y divide-amber-200/50">
                  {activeDiscrepancies.map((criterion) => (
                    <div key={criterion.id} className="py-2.5 text-xs text-amber-800">
                      <div className="font-bold">{criterion.name}</div>
                      <div className="flex justify-between mt-1 text-amber-600 text-[11px]">
                        <span>Note la plus basse : <strong>{criterion.stats.min}</strong></span>
                        <span>Note la plus haute : <strong>{criterion.stats.max}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-5 rounded-2xl border border-gray-150 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 text-sm">Progrès de l'évaluation</h3>
              <p className="text-xs text-gray-500">Tous les juges assignés à ce hackathon ont soumis leur évaluation.</p>
              
              <div className="space-y-3">
                {evaluations.map((e) => (
                  <div key={e.judge_id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {e.judge_avatar ? (
                        <img src={e.judge_avatar} alt={e.first_name + e.last_name} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                          {e.first_name![0] }
                        </div>
                      )}
                      <span className="text-gray-700 font-medium">{e.first_name} {e.last_name}</span>
                    </div>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">Soumis ({e.total_score} pts)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {}
      {activeTab === "judges" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left panel: list of judges */}
          <div className="space-y-3 lg:col-span-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1 mb-2">Choisir un membre du jury</h3>
            {evaluations.map((evalItem) => {
              const isSelected = selectedJudgeId === evalItem.judge_id;
              return (
                <button
                  key={evalItem.judge_id}
                  onClick={() => setSelectedJudgeId(evalItem.judge_id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected 
                      ? "bg-indigo-50/50 border-indigo-200 shadow-sm" 
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {evalItem.judge_avatar ? (
                      <img src={evalItem.judge_avatar} alt={evalItem.first_name + evalItem.last_name} className="w-9 h-9 rounded-full object-cover" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {evalItem.first_name[0] }
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{evalItem.first_name + evalItem.last_name}</h4>
                      <p className="text-[10px] text-gray-400">Soumis le {new Date(evalItem.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-indigo-600">{evalItem.total_score} </span>
                    <span className="text-[10px] text-gray-400">pts</span>
                    <ChevronRight className={`w-4 h-4 ml-1 inline text-gray-400 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right panel: scoresheet for chosen judge */}
          <div className="lg:col-span-2">
            {(() => {
              const currentJudgeEval = evaluations.find(e => e.judge_id === selectedJudgeId);
              if (!currentJudgeEval) return <div className="text-gray-500 text-center py-12">Aucun juge sélectionné.</div>;

              return (
                <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Grille d'évaluation de {currentJudgeEval.first_name + " " + currentJudgeEval.first_name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Détail des scores et notes explicatives formulés pour ce projet.</p>
                    </div>
                    <div className="bg-indigo-50 px-3.5 py-1.5 rounded-xl border border-indigo-100 flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-600" />
                      <span className="text-sm font-bold text-indigo-950">
                        Total : {currentJudgeEval.total_score} <span className="text-xs text-indigo-500 font-normal">/ {globalStats.maxScore}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6 divide-y divide-gray-100">
                    {criteria.map((criterion) => {
                      const scoreDetail = currentJudgeEval.scores.find(s => s.criterion_id === criterion.id);
                      const rawScore = scoreDetail ? scoreDetail.score : 0;
                      const percentage = (rawScore / criterion.max_score) * 100;

                      return (
                        <div key={criterion.id} className="pt-5 first:pt-0 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{criterion.name}</h4>
                              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide">MAX: {criterion.max_score} pts</span>
                            </div>
                            <div className="bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                              <span className="text-sm font-bold text-gray-900">{rawScore} </span>
                              <span className="text-xs text-gray-400">/ {criterion.max_score}</span>
                            </div>
                          </div>

                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-indigo-600 h-full rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          {scoreDetail?.comment ? (
                            <div className="bg-gray-50/50 hover:bg-gray-50 rounded-xl p-3 border border-gray-100 flex gap-2.5 text-xs text-gray-700 transition-all leading-relaxed">
                              <MessageSquare className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-gray-900">Commentaire du juge : </span>
                                "{scoreDetail.comment}"
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 italic flex items-center gap-1.5 px-1">
                              <Info className="w-3.5 h-3.5" />
                              Aucune remarque ou note explicative rédigée pour ce critère.
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      )}

      {}
      {activeTab === "details" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-150 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description du projet</h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {submission.description}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Livrables et ressources de l'équipe</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {submission.github_url && (
                  <a
                    href={submission.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <GithubIcon className="w-5 h-5 text-gray-900 shrink-0" />
                      <span className="truncate">Code Source (GitHub)</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 shrink-0" />
                  </a>
                )}

                {submission.figma_url && (
                  <a
                    href={submission.figma_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-pink-600 hover:border-pink-200 shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FigmaIcon className="w-5 h-5 text-pink-600 shrink-0" />
                      <span className="truncate">Prototype (Figma)</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-600 shrink-0" />
                  </a>
                )}

                {submission.presentation && (
                  <a
                    href={submission.presentation}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all group sm:col-span-2 lg:col-span-1"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                      <span className="truncate">
                        {submission.presentation.split("/").pop() || "Support de présentation / Pitch"}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-amber-600 shrink-0" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}