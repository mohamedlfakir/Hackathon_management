import React, { useState } from "react";
import { Users, UserPlus, Trash2, Mail, Loader2 } from "lucide-react";

// Structure type d'un juge (ajustable selon votre backend)
export interface Judge {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  specialty?: string;
}

interface HackathonJudgesSectionProps {
  judges: Judge[];
  onOpenAssignModal: () => void;
  onRemoveJudge: (judgeId: number) => Promise<void> | void;
}

export default function HackathonJudgesSection({
  judges,
  onOpenAssignModal,
  onRemoveJudge,
}: HackathonJudgesSectionProps): React.JSX.Element {
  // Permet de bloquer le bouton et d'afficher un loader uniquement sur le juge en cours de suppression
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemoveClick = async (judgeId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir retirer ce juge de ce hackathon ?")) {
      return;
    }
    
    try {
      setRemovingId(judgeId);
      await onRemoveJudge(judgeId);
    } catch (error) {
      console.error("Erreur lors du retrait du juge:", error);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* En-tête de section */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-lg text-gray-900">Jury de l'événement</h3>
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {judges.length}
          </span>
        </div>
        <button
          onClick={onOpenAssignModal}
          className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg shadow-sm transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Assigner
        </button>
      </div>

      {/* Liste des juges */}
      <div className="divide-y divide-gray-100 max-h-[320px] overflow-y-auto">
        {judges.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 italic">
            Aucun juge n'est assigné pour le moment.
          </div>
        ) : (
          judges.map((judge) => {
            const isRemoving = removingId === judge.id;
            
            return (
              <div
                key={judge.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50/60 transition-colors gap-3"
              >
                {/* Avatar & Identité */}
                <div className="flex items-center gap-3 min-w-0">
                  {judge.avatar_url ? (
                    <img
                      src={judge.avatar_url}
                      alt={`${judge.first_name} ${judge.last_name}`}
                      className="w-9 h-9 rounded-full object-cover border border-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
                      {`${judge.first_name[0]}${judge.last_name[0]}`.toUpperCase()}
                    </div>
                  )}
                  
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {`${judge.first_name} ${judge.last_name}`}
                    </h4>
                    {judge.specialty && (
                      <p className="text-xs text-indigo-600 font-medium truncate mb-0.5">
                        {judge.specialty}
                      </p>
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1 truncate">
                      <Mail className="w-3 h-3 shrink-0" />
                      {judge.email}
                    </span>
                  </div>
                </div>

                {/* Bouton de suppression */}
                <button
                  disabled={isRemoving || removingId !== null}
                  onClick={() => handleRemoveClick(judge.id)}
                  title="Retirer ce juge"
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                >
                  {isRemoving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}