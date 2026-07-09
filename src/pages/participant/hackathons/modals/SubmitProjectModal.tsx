// src/pages/participant/modals/SubmitProjectModal.tsx
import React, { useState, useRef, useEffect } from "react";
import { X, FileText, UploadCloud, Loader2, AlertCircle, Trash2 } from "lucide-react";
import * as submissionService from "../../../../services/submission.service";
import type { Submission } from "../../../../api/submission.api";

interface SubmitProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSubmission?: Submission | null; // Si présent, la modale passe en mode édition
  onSuccess: () => void;
  hackathon_id: number
}

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
const MAX_FILE_SIZE_MB = 15;

export default function SubmitProjectModal({
  isOpen,
  onClose,
  existingSubmission,
  onSuccess,
  hackathon_id
}: SubmitProjectModalProps): React.JSX.Element | null {
  const isEditMode = !!existingSubmission;

  // ÉTATS DES FORMULAIRES
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [githubUrl, setGithubUrl] = useState<string>("");
  const [figmaUrl, setFigmaUrl] = useState<string>("");
  
  // ÉTATS DU FICHIER DE PRÉSENTATION
  const [presentationFile, setPresentationFile] = useState<File | null>(null);
  const [existingFileName, setExistingFileName] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  
  // ÉTATS DE STATUT
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialisation des données en mode édition
  useEffect(() => {
    if (existingSubmission) {
      setTitle(existingSubmission.title);
      setDescription(existingSubmission.description);
      setGithubUrl(existingSubmission.github_url || "");
      setFigmaUrl(existingSubmission.figma_url || "");
      if (existingSubmission.presentation) {
        // Extrait le nom du fichier depuis l'URL stockée
        const parts = existingSubmission.presentation.split("/");
        setExistingFileName(parts[parts.length - 1] || "Livrable de présentation");
      }
    } else {
      setTitle("");
      setDescription("");
      setGithubUrl("");
      setFigmaUrl("");
      setPresentationFile(null);
      setExistingFileName(null);
    }
  }, [existingSubmission, isOpen]);

  if (!isOpen) return null;

  // VALIDATION DU FICHIER
  const validateAndSetFile = (file: File) => {
    setError(null);
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError(`Format invalide. Extensions acceptées : ${ALLOWED_EXTENSIONS.join(", ")}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`Le fichier est trop lourd. Limite maximale de ${MAX_FILE_SIZE_MB} Mo.`);
      return;
    }

    setPresentationFile(file);
    setExistingFileName(null); // Le nouveau fichier remplace le précédent
  };

  // GESTION DU DRAG & DROP
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  // SOUMISSION DU FORMULAIRE COMPLET
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let submissionId = existingSubmission?.id;

      const payload = {
        title: title.trim(),
        description: description.trim(),
        github_url: githubUrl.trim() || undefined,
        figma_url: figmaUrl.trim() || undefined,
        hackathon_id: hackathon_id
      };

      // Étape 1 : Enregistrement ou mise à jour des métadonnées textuelles
      if (isEditMode && submissionId) {
        setUploadProgress("Mise à jour des informations...");
        await submissionService.updateSubmission(submissionId, payload);
      } else {
        setUploadProgress("Création du rendu de projet...");
        const newSubmission = await submissionService.createSubmission(payload);
        submissionId = newSubmission.id;
      }

      // Étape 2 : Envoi du fichier de présentation si un nouveau fichier est sélectionné
      if (presentationFile && submissionId) {
        setUploadProgress("Téléversement du fichier de présentation...");
        await submissionService.updatePresentation(submissionId, presentationFile);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de la soumission :", err);
      setError(err.message || "Une erreur est survenue lors de l'enregistrement de votre projet.");
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* EN-TÊTE */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {isEditMode ? "Modifier le livrable de projet" : "Soumettre le projet final"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Renseignez vos dépôts, maquettes et supports de présentation</p>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENU FORMULAIRE */}
        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* TITRE & DESCRIPTION */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-bold text-gray-700">
                Titre du projet <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                required
                disabled={submitting}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Plateforme Solidaire d'Entraide"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="desc" className="text-xs font-bold text-gray-700">
                Description & Fonctionnalités clés <span className="text-red-500">*</span>
              </label>
              <textarea
                id="desc"
                required
                rows={4}
                disabled={submitting}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez brièvement le problème ciblé, votre solution technique et les technologies déployées..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all resize-none"
              />
            </div>
          </div>

          {/* LIENS LIÉS AU DESIGN ET REPO (LIENS URL) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lien GitHub */}
            <div className="space-y-1.5">
              <label htmlFor="github" className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
               {/* <Github className="w-3.5 h-3.5 text-gray-700" />*/}
                <svg width="60px" height="60px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
    
                    <title>github [#142]</title>
                    <desc>Created with Sketch.</desc>
                    <defs>

                </defs>
                    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#000000">
                            <g id="icons" transform="translate(56.000000, 160.000000)">
                                <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]">

                </path>
                            </g>
                        </g>
                    </g>
                </svg>
                 Dépôt GitHub
              </label>
              <input
                id="github"
                type="url"
                disabled={submitting}
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/votre-projet"
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
              />
            </div>

            {/* Lien Figma */}
            <div className="space-y-1.5">
              <label htmlFor="figma" className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                
                <svg width="60px" height="60px" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M138.537 49.8665C172.959 49.17 227.435 43.1506 262.348 47.6652C299.831 52.5121 301.114 79.4384 302.448 90.1082C304.855 109.366 296.297 132.183 278.892 142.128C264.387 150.417 156.261 153.222 141.481 148.999C86.2989 133.233 82.8564 58.4925 128.722 50.8483" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M206.969 177.688C212.884 165.473 224.194 155.428 237.97 153.309C299.928 143.776 320.814 201.088 288.534 233.368C251.302 270.601 202.154 236.018 202.154 190.028" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M132.656 153.331C98.3507 162.932 84.6589 221.794 116.434 242.978C139.77 258.535 170.439 253.223 196.689 253.223" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M139.057 253.65C113.61 261.284 99.4829 278.251 96.3685 303.169C90.1475 352.939 164.405 374.498 190.284 329.209C202.949 307.045 197.737 275.506 198.822 251.088C202.15 176.173 196.687 114.151 198.822 46.6096" stroke="#000000" stroke-opacity="0.9" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
                </svg> Maquette Figma
              </label>
              <input
                id="figma"
                type="url"
                disabled={submitting}
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                placeholder="https://figma.com/file/..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition-all"
              />
            </div>
          </div>

          {/* DEPOSIT ZONE POUR LA PRESENTATION (DRAG AND DROP) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700">
              Support de Présentation / Pitch (Optionnel)
            </label>
            
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => !submitting && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                isDragActive ? "border-indigo-600 bg-indigo-50/50" : "border-gray-200 hover:bg-gray-50/50"
              } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="hidden"
                disabled={submitting}
              />

              {presentationFile || existingFileName ? (
                <div className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm max-w-full" onClick={(e) => e.stopPropagation()}>
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate">
                      {presentationFile ? presentationFile.name : existingFileName}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {presentationFile ? `${(presentationFile.size / (1024 * 1024)).toFixed(2)} Mo` : "Fichier enregistré précédemment"}
                    </p>
                  </div>
                  {!submitting && (
                    <button
                      type="button"
                      onClick={() => { setPresentationFile(null); setExistingFileName(null); }}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:text-indigo-600 transition-colors">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Glissez-déposez votre présentation ici</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Ou cliquez pour explorer vos fichiers locaux</p>
                  </div>
                  <div className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1">
                    PDF, PPT, PPTX, DOC, DOCX jusqu'à {MAX_FILE_SIZE_MB} Mo
                  </div>
                </>
              )}
            </div>
          </div>

        </form>

        {/* COMPOSANT DE CHARGEMENT PERSISTANT & SUBMIT FOOTER */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
          <div className="min-w-0">
            {uploadProgress && (
              <div className="flex items-center gap-2 text-indigo-600 animate-pulse text-xs font-semibold">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span className="truncate">{uploadProgress}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !description.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isEditMode ? "Enregistrer les modifications" : "Envoyer le livrable"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}