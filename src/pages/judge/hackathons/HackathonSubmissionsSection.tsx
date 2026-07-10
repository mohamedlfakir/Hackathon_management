import React from "react";
import { FolderGit2, ArrowRight, ExternalLink, GitBranch , Code2, AlertCircle, CheckCircle2 } from "lucide-react";

export interface SubmissionItem {
  id: number;
  title: string;
  tagline: string;
  submittedBy: string; // Nom de l'équipe ou du participant solo
  submittedAt: string;
  repoUrl?: string;
  demoUrl?: string;
  status: "PENDING" | "GRADED";
  score?: number;      // Note globale attribuée par les juges si existante
}

interface HackathonSubmissionsSectionProps {
  submissions: SubmissionItem[];
  onViewSubmission: (submissionId: number) => void;
}

export default function HackathonSubmissionsSection({
  submissions,
  onViewSubmission,
}: HackathonSubmissionsSectionProps): React.JSX.Element {

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* En-tête de section */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-lg text-gray-900">Projets Soumis</h3>
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {submissions.length}
          </span>
        </div>
      </div>

      {/* Liste des projets */}
      <div className="divide-y divide-gray-100">
        {submissions.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400 italic">
            Aucun projet n'a encore été soumis pour ce hackathon.
          </div>
        ) : (
          submissions.map((project) => (
            <div
              key={project.id}
              onClick={() => onViewSubmission(project.id)}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-gray-50/80 transition-all cursor-pointer gap-4"
            >
              {/* Infos principales du projet */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {project.title}
                  </h4>
                  <span className="text-xs text-gray-400">
                    par <span className="font-medium text-gray-600">{project.submittedBy}</span>
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-1">
                  {project.tagline || "Aucune description courte fournie."}
                </p>

                {/* Liens techniques rapides (Arrête la propagation du clic parent pour ne pas rediriger si on clique sur le lien) */}
                <div className="flex items-center gap-3 pt-1 text-xs text-gray-400" onClick={(e) => e.stopPropagation()}>
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-gray-900 bg-gray-100 px-2 py-0.5 rounded"
                    >
                      <GitBranch className="w-3 h-3" /> Code source
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-gray-900 bg-gray-100 px-2 py-0.5 rounded"
                    >
                      <ExternalLink className="w-3 h-3" /> Démo Live
                    </a>
                  )}
                  <span className="text-[11px]">Soumis le {formatDate(project.submittedAt)}</span>
                </div>
              </div>

              {/* État de la notation et bouton d'action */}
              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-0 pt-3 sm:pt-0 border-gray-100">
                {/* Badge d'évaluation admin */}
                <div className="text-right">
                  {project.status === "GRADED" ? (
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Évalué
                      </span>
                      {project.score !== undefined && (
                        <span className="text-sm font-bold text-gray-900 mt-0.5">
                          {project.score} <span className="text-xs text-gray-400 font-normal">/ 100</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3" /> À évaluer
                    </span>
                  )}
                </div>

                {/* Flèche d'action */}
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}