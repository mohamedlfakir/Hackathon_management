import React, { useState, useMemo } from "react";
import { 
  Trophy, 
  Medal, 
  Award, 
  Users, 
  User,
  Star, 
  ChevronRight,
  ListOrdered
} from "lucide-react";

import type { RankedSubmissionItem} from "../../../api/hackathon.api";

interface AdminRankedSubmissionsSectionProps {
  submissions: RankedSubmissionItem[];
  onViewDetails?: (submissionId: number) => void;
}

type FilterTab = "ALL" | "TEAM" | "SOLO";

export default function AdminRankedSubmissionsSection({
  submissions = [],
  onViewDetails,
}: AdminRankedSubmissionsSectionProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  // We sort by average_score first (and total_score as fallback) to establish global ranks
  const sortedSubmissions = useMemo(() => {
    const safeList = Array.isArray(submissions) ? submissions : [];
    return [...safeList]
      .sort((a, b) => {
        if (b.average_score !== a.average_score) {
          return b.average_score - a.average_score;
        }
        return b.total_score - a.total_score;
      })
      .map((item, index) => ({
        ...item,
        globalRank: index + 1, // Store true absolute rank
      }));
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    if (activeTab === "ALL") return sortedSubmissions;
    return sortedSubmissions.filter((sub) => {
      const isTeam = sub.team_id !== null || !!sub.team_name;
      return activeTab === "TEAM" ? isTeam : !isTeam;
    });
  }, [sortedSubmissions, activeTab]);

  const renderRankIndicator = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 px-2.5 py-1 rounded-lg shrink-0 font-bold text-xs shadow-sm">
            <Trophy className="w-4 h-4 text-amber-500 shrink-0 animate-bounce" />
            <span>1er 🥇</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg shrink-0 font-bold text-xs shadow-sm">
            <Medal className="w-4 h-4 text-slate-400 shrink-0" />
            <span>2e 🥈</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-800 px-2.5 py-1 rounded-lg shrink-0 font-bold text-xs shadow-sm">
            <Award className="w-4 h-4 text-orange-500 shrink-0" />
            <span>3e 🥉</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center bg-gray-50 border border-gray-200 text-gray-500 w-12 h-7 rounded-lg shrink-0 font-bold text-xs">
            <span>#{rank}</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* 1. SECTION HEADER */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ListOrdered className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-lg text-gray-900">Classement des Soumissions</h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
            {submissions.length}
          </span>
        </div>
      
      </div>

      {/* 2. FILTERING TABS (Matching the participants layouts) */}
      <div className="flex border-b border-gray-100 bg-gray-50/30 px-4 text-xs font-medium text-gray-500">
        {(["ALL", "TEAM", "SOLO"] as FilterTab[]).map((tab) => {
          const count = tab === "ALL"
            ? sortedSubmissions.length
            : sortedSubmissions.filter((s) => {
                const isTeam = s.team_id !== null || !!s.team_name;
                return tab === "TEAM" ? isTeam : !isTeam;
              }).length;

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
              {tab === "ALL" && `Tous les projets (${count})`}
              {tab === "TEAM" && `Équipes (${count})`}
              {tab === "SOLO" && `Individuels (${count})`}
            </button>
          );
        })}
      </div>

      {/* 3. RANKINGS ROW LIST */}
      <div className="divide-y divide-gray-100 max-h-[380px] overflow-y-auto">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400 italic">
            Aucun projet classé dans cette catégorie.
          </div>
        ) : (
          filteredSubmissions.map((item) => {
            const isTeam = item.team_id !== null || !!item.team_name;
            const displayName = isTeam 
              ? (item.team_name || "Équipe sans nom")
              : (item.first_name && item.last_name ? `${item.first_name} ${item.last_name}` : "Candidat Solo");

            return (
              <div
                key={`sub-${item.id}`}
                onClick={() => onViewDetails && onViewDetails(item.id)}
                className={`flex items-center justify-between p-4 hover:bg-gray-50/60 transition-colors gap-3 ${
                  onViewDetails ? "cursor-pointer" : ""
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Rank badge helper */}
                  {renderRankIndicator(item.globalRank)}

                  {/* Project Type Icon Badge */}
                  {isTeam ? (
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
                      <Users className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}

                  {/* Text details metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isTeam 
                          ? "bg-emerald-100 text-emerald-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {isTeam ? "Équipe" : "Solo"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      Par : <span className="font-semibold text-gray-700">{displayName}</span>
                    </p>
                  </div>
                </div>

                {/* Score indicators right side */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                      <span className="text-sm font-extrabold text-gray-900">
                        {Number(item.average_score).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Total: {item.total_score} pts ({item.judges_count} {item.judges_count > 1 ? "avis" : "avis"})
                    </p>
                  </div>
                  {onViewDetails && (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}