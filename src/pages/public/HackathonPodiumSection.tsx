import React from "react";
import { Trophy, Medal, Crown, Star } from "lucide-react";
import type { RankedSubmissionItem } from "../../api/hackathon.api";

interface HackathonPodiumSectionProps {
  winners: RankedSubmissionItem[];
}

export default function HackathonPodiumSection({ winners = [] }: HackathonPodiumSectionProps): React.JSX.Element | null {
  // On s'assure d'avoir un tableau valide
  const safeWinners = Array.isArray(winners) ? winners : [];

  if (safeWinners.length === 0) return null;

  // Extraction des 3 premières places
  const firstPlace = safeWinners[0];
  const secondPlace = safeWinners[1];
  const thirdPlace = safeWinners[2];

  const getDisplayName = (item: RankedSubmissionItem) => {
    if (item.team_name) return item.team_name;
    if (item.first_name || item.last_name) {
      return `${item.first_name || ""} ${item.last_name || ""}`.trim();
    }
    return "Candidat Solo";
  };

  return (
    <div className="w-full bg-gradient-to-br from-amber-50 via-white to-orange-50 border border-amber-200/60 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="text-center max-w-md mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" /> Palmarès Final
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-2 tracking-tight">
          Tableau des Vainqueurs
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Félicitations à l'ensemble des participants pour leurs innovations.
        </p>
      </div>

      {/* Grille du Podium : Ordre visuel [ 2ème | 1er | 3ème ] */}
      <div className="grid grid-cols-3 gap-3 md:gap-6 items-end max-w-4xl mx-auto pt-6 text-center">
        
        {/* ================= 2ÈME PLACE (À GAUCHE) ================= */}
        <div className="order-1 flex flex-col items-center">
          {secondPlace ? (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <div className="relative mb-3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center shadow-md">
                  <Medal className="w-6 h-6 md:w-8 md:h-8 text-slate-500" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-slate-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  2
                </span>
              </div>
              <div className="px-1 truncate max-w-full">
                <h4 className="font-bold text-sm md:text-base text-gray-800 truncate">
                  {getDisplayName(secondPlace)}
                </h4>
                <p className="text-[11px] md:text-xs text-gray-500 truncate italic px-1">
                  « {secondPlace.title} »
                </p>
              </div>
              {/* Colonne graphique du podium */}
              <div className="w-full bg-gradient-to-t from-slate-200/80 to-slate-100/40 border border-slate-200 rounded-t-xl mt-4 h-24 md:h-32 flex flex-col justify-center items-center shadow-sm">
                <span className="text-xs font-bold text-slate-700">
                  {Number(secondPlace.average_score).toFixed(2)} pts
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {secondPlace.judges_count} votes
                </span>
              </div>
            </div>
          ) : (
            <div className="h-24 w-full bg-gray-50/50 border border-dashed border-gray-200 rounded-t-xl" />
          )}
        </div>

        {/* ================= 1ÈRE PLACE (AU CENTRE - PLUS GRAND) ================= */}
        <div className="order-2 flex flex-col items-center z-10">
          {firstPlace ? (
            <div className="w-full flex flex-col items-center scale-105 md:scale-110 transform transition-all">
              {/* Couronne animée au dessus du gagnant */}
              <Crown className="w-6 h-6 text-amber-500 animate-bounce mb-1 drop-shadow-sm" />
              <div className="relative mb-3">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-amber-500 border-4 border-amber-300 flex items-center justify-center shadow-xl ring-4 ring-amber-100">
                  <Trophy className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow">
                  1
                </span>
              </div>
              <div className="px-1 truncate max-w-full">
                <h3 className="font-extrabold text-base md:text-lg text-amber-950 truncate tracking-tight">
                  {getDisplayName(firstPlace)}
                </h3>
                <p className="text-xs font-semibold text-amber-800 truncate px-1">
                  « {firstPlace.title} »
                </p>
              </div>
              {/* Grande colonne graphique du podium */}
              <div className="w-full bg-gradient-to-t from-amber-200 to-amber-100/50 border border-amber-300 rounded-t-xl mt-4 h-36 md:h-48 flex flex-col justify-center items-center shadow-md ring-1 ring-amber-200/50">
                <div className="flex items-center gap-0.5 text-amber-600 mb-1">
                  <Star className="w-3 h-3 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-sm font-black text-amber-900">
                  {Number(firstPlace.average_score).toFixed(2)} pts
                </span>
                <span className="text-[10px] text-amber-700 font-bold">
                  {firstPlace.judges_count} votes
                </span>
              </div>
            </div>
          ) : (
            <div className="h-36 w-full bg-gray-50/50 border border-dashed border-gray-200 rounded-t-xl" />
          )}
        </div>

        {/* ================= 3ÈME PLACE (À DROITE) ================= */}
        <div className="order-3 flex flex-col items-center">
          {thirdPlace ? (
            <div className="w-full flex flex-col items-center animate-fade-in">
              <div className="relative mb-3">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-amber-50 border-2 border-orange-200 flex items-center justify-center shadow-md">
                  <Medal className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                </div>
                <span className="absolute -bottom-1 -right-1 bg-orange-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  3
                </span>
              </div>
              <div className="px-1 truncate max-w-full">
                <h4 className="font-bold text-sm md:text-base text-gray-800 truncate">
                  {getDisplayName(thirdPlace)}
                </h4>
                <p className="text-[11px] md:text-xs text-gray-500 truncate italic px-1">
                  « {thirdPlace.title} »
                </p>
              </div>
              {/* Colonne graphique du podium */}
              <div className="w-full bg-gradient-to-t from-orange-100 to-orange-50/30 border border-orange-200 rounded-t-xl mt-4 h-20 md:h-24 flex flex-col justify-center items-center shadow-sm">
                <span className="text-xs font-bold text-orange-800">
                  {Number(thirdPlace.average_score).toFixed(2)} pts
                </span>
                <span className="text-[10px] text-orange-400 font-medium">
                  {thirdPlace.judges_count} votes
                </span>
              </div>
            </div>
          ) : (
            <div className="h-20 w-full bg-gray-50/50 border border-dashed border-gray-200 rounded-t-xl" />
          )}
        </div>

      </div>
    </div>
  );
}