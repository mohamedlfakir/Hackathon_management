import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import * as evaluationService from "../../../services/evaluation.service";
import * as submissionService from "../../../services/submission.service";

import { 
  ArrowLeft, 
  FileText, 
  ExternalLink, 
  Star, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Award 
} from "lucide-react";

export interface EvaluationCriterion {
  id: number;
  code: string;
  name: string;
  max_score: number;
}

interface SubmissionDetails {
  id: number;
  title: string;
  description: string;
  team_name: string;
  github_url?: string;
  figma_url?: string;
  presentation?: string;
  created_at: string;
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

export default function JudgeSubmissionDetailsPage(): React.JSX.Element {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const id = Number(submissionId);

  // States for submission & criteria data
  const [submission, setSubmission] = useState<SubmissionDetails | null>(null);
  const [criteria, setCriteria] = useState<EvaluationCriterion[]>([]);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, string>>({});

  // UI States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      if (isNaN(id)) {
        setError("Identifiant de soumission invalide.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const [criteriaData, submissionData, existingEvaluations] = await Promise.all([
          evaluationService.getEvaluationCriteria(),
          submissionService.getSubmissionById(id),
          evaluationService.getMyEvaluations(id).catch(() => []) // Silent fallback if no prior evaluations exist
        ]);

        setCriteria(criteriaData);
        setSubmission(submissionData);

        const initialScores: Record<number, number> = {};
        const initialComments: Record<number, string> = {};
        
        criteriaData.forEach((c: { id: number | number; }) => {
          initialScores[c.id] = 0;
          initialComments[c.id] = "";
        });

        if (existingEvaluations && existingEvaluations.length > 0) {
          existingEvaluations.forEach((evalItem: any) => {
            if (evalItem.criterion_id) {
              initialScores[evalItem.criterion_id] = evalItem.score ?? 0;
              initialComments[evalItem.criterion_id] = evalItem.comment ?? "";
            }
          });
        }

        setScores(initialScores);
        setComments(initialComments);

      } catch (err: any) {
        console.error("Error loading judging view data from services:", err);
        setError(err.message || "Une erreur est survenue lors de la récupération des données de la soumission.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleScoreChange = (criterionId: number, value: number, max: number) => {
    const safeValue = Math.min(max, Math.max(0, value));
    setScores((prev) => ({ ...prev, [criterionId]: safeValue }));
  };

  const handleCommentChange = (criterionId: number, value: string) => {
    setComments((prev) => ({ ...prev, [criterionId]: value }));
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const maxPossibleScore = criteria.reduce((sum, c) => sum + c.max_score, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionId) return;

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(false);

      const payload = criteria.map((c) => ({
        criterion_id: c.id,
        score: scores[c.id] || 0,
        comment: comments[c.id] || "",
      }));

      await evaluationService.submitEvaluation(submissionId, payload);
      
      setSuccess(true);
      setTimeout(() => {
        navigate("/myspace/hackathons");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Impossible d'enregistrer l'évaluation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 font-medium animate-pulse">Chargement de la fiche d'évaluation...</p>
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4">
      
      {/* HEADER SECTION */}
      <div className="space-y-2">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" /> 
          Retour aux projets
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{submission.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Projet soumis par l'équipe : <span className="font-bold text-indigo-600">{submission.team_name}</span>
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 flex items-center gap-2 self-start md:self-center">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-900">
              Note Totale : {totalScore} <span className="text-xs text-blue-500 font-normal">/ {maxPossibleScore}</span>
            </span>
          </div>
        </div>
      </div>

      {/* STATE NOTIFICATIONS */}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>Évaluation enregistrée avec succès ! Redirection en cours...</div>
        </div>
      )}

      {/* TWO COLUMN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: SUBMISSION DETAILS AND SHARING CARDS (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description du projet</h3>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                {submission.description}
              </p>
            </div>

            {/* Beautiful resources integration cards */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Livrables et ressources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                {/* Source code (GitHub) */}
                {submission.github_url && (
                  <a
                    href={submission.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <GithubIcon className="w-5 h-5 text-gray-900 shrink-0" />
                      <span className="truncate">Code Source (GitHub)</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 shrink-0" />
                  </a>
                )}

                {/* UI/UX mockup (Figma) */}
                {submission.figma_url && (
                  <a
                    href={submission.figma_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-pink-600 hover:border-pink-200 shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FigmaIcon className="w-5 h-5 text-pink-600 shrink-0" />
                      <span className="truncate">Prototype (Figma)</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-pink-600 shrink-0" />
                  </a>
                )}

                {/* Pitch deck presentation file */}
                {submission.presentation && (
                  <a
                    href={submission.presentation}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all group sm:col-span-2"
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

        {/* RIGHT COLUMN: EVALUATION CONTROL SIDEBAR (1/3) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6 sticky top-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Formulaire de notation</h2>
            <p className="text-xs text-gray-500 mt-0.5">Notez et commentez directement chaque critère requis.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {criteria.map((criterion) => {
                const currentScore = scores[criterion.id] || 0;
                return (
                  <div key={criterion.id} className="space-y-3 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{criterion.name}</h4>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wide">Max: {criterion.max_score} pts</span>
                      </div>
                      
                      {/* Compact input picker */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          min={0}
                          max={criterion.max_score}
                          disabled={isSubmitting || success}
                          value={currentScore}
                          onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value, 10) || 0, criterion.max_score)}
                          className="w-14 px-1 py-1 text-center font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-xs"
                        />
                        <span className="text-xs font-semibold text-gray-400">/ {criterion.max_score}</span>
                      </div>
                    </div>

                    {/* Slider picker representation */}
                    <div className="flex items-center">
                      <input
                        type="range"
                        min={0}
                        max={criterion.max_score}
                        disabled={isSubmitting || success}
                        value={currentScore}
                        onChange={(e) => handleScoreChange(criterion.id, parseInt(e.target.value, 10), criterion.max_score)}
                        className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
                      />
                    </div>

                    {/* Integrated dynamic comment for the selected criterion */}
                    <div className="relative flex items-start gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-2 shrink-0" />
                      <textarea
                        rows={2}
                        disabled={isSubmitting || success}
                        placeholder={`Note explicative sur "${criterion.name.toLowerCase()}"...`}
                        value={comments[criterion.id] || ""}
                        onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                        className="w-full text-xs text-gray-600 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 resize-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION FOOTER BUTTONS */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || success || criteria.length === 0}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer l'évaluation
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="w-full text-center py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors border border-gray-200 rounded-xl hover:bg-gray-50"
              >
                Annuler l'évaluation
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}