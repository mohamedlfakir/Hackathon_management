import { useState, type ReactNode } from "react";
import {
  Search,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Users,
  User,
  ExternalLink,
  Award,
  Gavel,
  Star,
} from "lucide-react";
import { adminColors, adminFonts } from "../../theme/adminTokens";

// Adaptez/remplacez ces hooks selon vos services d'API réels
import { useEvaluations, type Evaluation } from "../../hooks/useEvaluations";
import { useHackathons } from "../../hooks/useHackathons";
import { useJudges } from "../../hooks/useJudges"; // Hook optionnel pour récupérer la liste des juges

type SortableColumn = "title" | "judge" | "hackathon" | "score" | "evaluated_at";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function Evaluations() {
  const { hackathons } = useHackathons();
  const { judges } = useJudges(); // Liste des juges pour le filtre dropdown

  const {
    evaluations,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    hackathonFilter,
    setHackathonFilter,
    judgeFilter,
    setJudgeFilter,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
  } = useEvaluations({ pageSize: 10 });

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-5">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1
            style={{
              fontFamily: adminFonts.heading,
              color: adminColors.text,
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            Évaluations
          </h1>
          <p
            style={{
              fontFamily: adminFonts.body,
              color: adminColors.muted,
              fontSize: 13.5,
            }}
            className="mt-0.5"
          >
            {total} évaluation{total > 1 ? "s" : ""} au total
          </p>
        </div>
      </div>

      {/* Barre d'outils : Recherche + Filtre Hackathon + Filtre Juge */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Champ de recherche */}
        <div
          style={{
            background: adminColors.surface,
            border: `1px solid ${adminColors.border}`,
          }}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 flex-1 min-w-[220px] max-w-sm"
        >
          <Search size={15} color={adminColors.faint} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par projet, équipe, juge..."
            style={{
              fontFamily: adminFonts.body,
              color: adminColors.text,
              fontSize: 13.5,
            }}
            className="bg-transparent outline-none w-full placeholder:opacity-60"
          />
        </div>

        {/* Filtre par Hackathon */}
        <select
          value={hackathonFilter}
          onChange={(e) => setHackathonFilter(e.target.value)}
          style={{
            fontFamily: adminFonts.body,
            color: adminColors.text,
            border: `1px solid ${adminColors.border}`,
            background: adminColors.surface,
          }}
          className="rounded-md px-3 py-2.5 text-sm outline-none cursor-pointer min-w-[180px]"
        >
          <option value="ALL">Tous les hackathons</option>
          {hackathons?.map((h) => (
            <option key={h.id} value={h.id}>
              {h.title}
            </option>
          ))}
        </select>

        {/* Filtre par Juge */}
        <select
          value={judgeFilter}
          onChange={(e) => setJudgeFilter(e.target.value)}
          style={{
            fontFamily: adminFonts.body,
            color: adminColors.text,
            border: `1px solid ${adminColors.border}`,
            background: adminColors.surface,
          }}
          className="rounded-md px-3 py-2.5 text-sm outline-none cursor-pointer min-w-[180px]"
        >
          <option value="ALL">Tous les juges</option>
          {judges?.map((j) => (
            <option key={j.id} value={j.id}>
              {j.first_name || j.last_name
                ? `${j.first_name || ""} ${j.last_name || ""}`.trim()
                : j.email || `@${j.username}`}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau des Évaluations */}
      <div
        style={{
          background: adminColors.surface,
          border: `1px solid ${adminColors.border}`,
        }}
        className="rounded-xl overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${adminColors.border}` }}>
              <SortableHeader
                label="Projet / Équipe"
                column="title"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Hackathon"
                column="hackathon"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Juge / Évaluateur"
                column="judge"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Note attribuée"
                column="score"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={toggleSort}
              />
              <SortableHeader
                label="Évalué le"
                column="evaluated_at"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={toggleSort}
              />
              <th
                className="px-4 py-3 text-right"
                style={{
                  fontFamily: adminFonts.body,
                  color: adminColors.muted,
                  fontSize: 12.5,
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Squelette de chargement */}
            {loading &&
              Array.from({ length: limit }).map((_, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: `1px solid ${adminColors.border}` }}
                >
                  <td colSpan={6} className="px-4 py-4">
                    <div
                      style={{ background: adminColors.surfaceHover }}
                      className="h-4 rounded animate-pulse"
                    />
                  </td>
                </tr>
              ))}

            {/* Message d'erreur */}
            {!loading && error && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center"
                  style={{
                    fontFamily: adminFonts.body,
                    color: adminColors.danger,
                    fontSize: 13.5,
                  }}
                >
                  {error}
                </td>
              </tr>
            )}

            {/* Liste vide */}
            {!loading && !error && evaluations.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center"
                  style={{
                    fontFamily: adminFonts.body,
                    color: adminColors.muted,
                    fontSize: 13.5,
                  }}
                >
                  Aucune évaluation ne correspond à ces critères.
                </td>
              </tr>
            )}

            {/* Lignes d'évaluation */}
            {!loading &&
              !error &&
              evaluations.map((evaluation) => (
                <tr
                  key={evaluation.id}
                  style={{ borderBottom: `1px solid ${adminColors.border}` }}
                >
                  {/* Titre du projet & Équipe / Auteur */}
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <div
                        style={{
                          fontFamily: adminFonts.body,
                          color: adminColors.text,
                          fontWeight: 600,
                          fontSize: 13.5,
                        }}
                        className="truncate flex items-center gap-1.5"
                      >
                        {evaluation.submission_title}
                        {evaluation.demo_url && (
                          <a
                            href={evaluation.demo_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: adminColors.faint }}
                            className="hover:opacity-100"
                            title="Ouvrir le projet"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>

                      <div
                        style={{
                          fontFamily: adminFonts.body,
                          color: adminColors.faint,
                          fontSize: 12,
                        }}
                        className="truncate flex items-center gap-1 mt-0.5"
                      >
                        {evaluation.team_name ? (
                          <>
                            <Users size={12} className="shrink-0" />
                            <span>Équipe: {evaluation.team_name}</span>
                          </>
                        ) : (
                          <>
                            <User size={12} className="shrink-0" />
                            <span>Auteur: {evaluation.author_name || "Individuel"}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Hackathon */}
                  <td
                    className="px-4 py-3"
                    style={{
                      fontFamily: adminFonts.body,
                      color: adminColors.muted,
                      fontSize: 13,
                    }}
                  >
                    {evaluation.hackathon_title}
                  </td>

                  {/* Juge */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Gavel size={13} color={adminColors.faint} className="shrink-0" />
                      <span
                        style={{
                          fontFamily: adminFonts.body,
                          color: adminColors.text,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {evaluation.judge_name || `@${evaluation.judge_username}`}
                      </span>
                    </div>
                  </td>

                  {/* Note */}
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-1 font-semibold text-sm">
                      <Star size={13} className="text-amber-500 fill-amber-500" />
                      <span
                        style={{
                          fontFamily: adminFonts.body,
                          color: adminColors.text,
                          fontSize: 13.5,
                        }}
                      >
                        {evaluation.score !== undefined ? `${evaluation.score}/100` : "—"}
                      </span>
                    </div>
                  </td>

                  {/* Date d'évaluation */}
                  <td
                    className="px-4 py-3"
                    style={{
                      fontFamily: adminFonts.body,
                      color: adminColors.muted,
                      fontSize: 13,
                    }}
                  >
                    {new Date(evaluation.evaluated_at).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>

                  {/* Action : Voir uniquement */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/myspace/evaluations/${evaluation.id}`}
                        style={{ color: adminColors.muted }}
                        className="p-1.5 rounded-md hover:opacity-70 transition-opacity"
                        aria-label="Voir le détail de l'évaluation"
                        title="Voir le détail"
                      >
                        <Eye size={15} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pied de page avec pagination */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap"
          style={{ borderTop: `1px solid ${adminColors.border}` }}
        >
          <div className="flex items-center gap-2">
            <span
              style={{
                fontFamily: adminFonts.body,
                color: adminColors.muted,
                fontSize: 12.5,
              }}
            >
              {from}–{to} sur {total}
            </span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              style={{
                fontFamily: adminFonts.body,
                color: adminColors.text,
                border: `1px solid ${adminColors.border}`,
                fontSize: 12.5,
              }}
              className="rounded-md px-2 py-1 outline-none"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <PageButton onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft size={15} />
            </PageButton>
            <PageButton onClick={() => setPage(page - 1)} disabled={page === 1}>
              <ChevronLeft size={15} />
            </PageButton>
            <span
              style={{
                fontFamily: adminFonts.body,
                color: adminColors.text,
                fontSize: 12.5,
              }}
              className="px-2"
            >
              {page} / {totalPages || 1}
            </span>
            <PageButton
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronRight size={15} />
            </PageButton>
            <PageButton
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronsRight size={15} />
            </PageButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortableHeader({
  label,
  column,
  sortBy,
  sortOrder,
  onSort,
}: {
  label: string;
  column: SortableColumn;
  sortBy: SortableColumn;
  sortOrder: "asc" | "desc";
  onSort: (c: SortableColumn) => void;
}) {
  const active = sortBy === column;
  return (
    <th className="px-4 py-3 text-left">
      <button
        onClick={() => onSort(column)}
        style={{
          fontFamily: adminFonts.body,
          color: active ? adminColors.text : adminColors.muted,
          fontSize: 12.5,
          fontWeight: active ? 700 : 500,
        }}
        className="flex items-center gap-1 hover:opacity-70 transition-opacity"
      >
        {label}
        {active &&
          (sortOrder === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
      </button>
    </th>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{ color: adminColors.muted, opacity: disabled ? 0.35 : 1 }}
      className="p-1.5 rounded-md hover:opacity-70 disabled:cursor-not-allowed transition-opacity"
    >
      {children}
    </button>
  );
}