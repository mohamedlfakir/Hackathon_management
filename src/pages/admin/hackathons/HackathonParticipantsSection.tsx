import React, { useState, useMemo } from "react";
import { User, Users, UserPlus, Calendar, ShieldAlert } from "lucide-react";

export interface ParticipantItem {
  id: number;
  type: "SOLO" | "TEAM";
  name: string;
  contact: string;       // Email de l'utilisateur ou du chef d'équipe
  memberCount?: number;  // Spécifique aux équipes (ex: 4)
  registeredAt: string;  // Date d'inscription
}

interface HackathonParticipantsSectionProps {
  participants: ParticipantItem[];
  onOpenRegisterModal: () => void;
}

type FilterTab = "ALL" | "TEAM" | "SOLO";

export default function HackathonParticipantsSection({
  participants,
  onOpenRegisterModal,
}: HackathonParticipantsSectionProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  // Formatage rapide de la date d'inscription
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });
  };

  // Filtrage local ultra-rapide selon l'onglet actif
  const filteredParticipants = useMemo(() => {
    if (activeTab === "ALL") return participants;
    return participants.filter((p) => p.type === activeTab.toLowerCase());
  }, [participants, activeTab]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* 1. EN-TÊTE DE SECTION */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-lg text-gray-900">Inscriptions</h3>
          <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">
            {participants.length}
          </span>
        </div>
        <button
          onClick={onOpenRegisterModal}
          className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-sm transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Inscrire
        </button>
      </div>  

      {/* 2. BARRE D'ONGLETS DE FILTRAGE */}
      <div className="flex border-b border-gray-100 bg-gray-50/30 px-4 text-xs font-medium text-gray-500">
        {(["ALL", "TEAM", "SOLO"] as FilterTab[]).map((tab) => {
          const count = tab === "ALL" 
            ? participants.length 
            : participants.filter(p => p.type === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2.5 px-3 border-b-2 transition-all -mb-px font-semibold ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent hover:text-gray-900 hover:border-gray-200"
              }`}
            >
              {tab === "ALL" && `Tout (${count})`}
              {tab === "TEAM" && `Équipes (${count})`}
              {tab === "SOLO" && `Solos (${count})`}
            </button>
          );
        })}
      </div>

      {/* 3. LISTE DES PARTICIPANTS */}
      <div className="divide-y divide-gray-100 max-h-[360px] overflow-y-auto">
        {filteredParticipants.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 italic">
            Aucun inscrit dans cette catégorie.
          </div>
        ) : (
          filteredParticipants.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center justify-between p-4 hover:bg-gray-50/60 transition-colors gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Icône changeante selon le type */}
                {item.type === "TEAM" ? (
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Users className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}

                {/* Métadonnées textuelles */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </h4>
                    {item.type === "TEAM" && item.memberCount && (
                      <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                        {item.memberCount} membres
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-0.5" title={item.contact}>
                    {item.contact}
                  </p>
                </div>
              </div>

              {/* Badge Date d'inscription */}
              <div className="flex items-center gap-1 text-gray-400 text-[11px] font-medium shrink-0 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(item.registeredAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}