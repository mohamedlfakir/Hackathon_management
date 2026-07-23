import { useState, type ReactNode } from "react";
import {
  Search,
  Eye,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  Clock,
  Users,
  User,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { adminColors, adminFonts } from "../../theme/adminTokens";
// Replace or adapt these hooks/services to match your actual API integration
import { useSubmissions, type Submission } from "../../hooks/useSubmissions";
import { useHackathons } from "../../hooks/useHackathons"; 
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";

type SortableColumn = "title" | "team_name" | "hackathon" | "score" | "submitted_at";

const STATUS_FILTERS = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "COMPLETED", label: "Évalués" },
  { value: "UNEVALUATED", label: "Non évalués" },
  { value: "IN_PROGRESS" , label: "En cours"}
] as const;

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function Submissions() {
  const { hackathons } = useHackathons(); // Optional hook for the hackathons list

  const {
    submissions,
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
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch,
    deleteSubmission,
  } = useSubmissions({ pageSize: 10 });

  const [deletingSubmission, setDeletingSubmission] = useState<Submission | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!deletingSubmission) return;
    setDeleting(true);
    try {
      await deleteSubmission(deletingSubmission.id);
      setDeletingSubmission(null);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);


  const getStatusConfig = (status: string, adminColors: any) => {
  switch (status) {
    case "COMPLETED":
      return {
        label: "Évalué",
        icon: <CheckCircle2 size={12} />,
        style: {
          background: adminColors.accentSoft || "rgba(34, 197, 94, 0.15)",
          color: adminColors.accentText || "#166534",
        },
      };
    case "IN_PROGRESS":
      return {
        label: "En cours",
        icon: <Clock size={12} />,
        style: {
          background: adminColors.warningSoft || "rgba(245, 158, 11, 0.15)",
          color: adminColors.warningText || "#b45309",
        },
      };
    case "UNEVALUATED":
    default:
      return {
        label: "Non évalué",
        icon: <AlertCircle size={12} />,
        style: {
          background: adminColors.surfaceHover,
          color: adminColors.muted,
        },
      };
  }
};


  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 22 }}>
            Soumissions
          </h1>
          <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }} className="mt-0.5">
            {total} soumission{total > 1 ? "s" : ""} au total
          </p>
        </div>
      </div>

      {/* Toolbar: Search + Hackathon Filter + Status Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search input */}
        <div
          style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 flex-1 min-w-[220px] max-w-sm"
        >
          <Search size={15} color={adminColors.faint} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par projet, équipe..."
            style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5 }}
            className="bg-transparent outline-none w-full placeholder:opacity-60"
          />
        </div>

        {/* Hackathon Select Filter */}
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

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'UNEVALUATED' | 'IN_PROGRESS' | 'COMPLETED')}
          style={{
            fontFamily: adminFonts.body,
            color: adminColors.text,
            border: `1px solid ${adminColors.border}`,
            background: adminColors.surface,
          }}
          className="rounded-md px-3 py-2.5 text-sm outline-none cursor-pointer"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submissions Table */}
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="rounded-xl overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${adminColors.border}` }}>
              <SortableHeader label="Projet / Équipe" column="title" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <SortableHeader label="Hackathon" column="hackathon" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <th
                className="px-4 py-3 text-left"
                style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}
              >
                Statut
              </th>
              <SortableHeader label="Note" column="score" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <SortableHeader label="Soumis le" column="submitted_at" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <th
                className="px-4 py-3 text-right"
                style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: limit }).map((_, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                  <td colSpan={6} className="px-4 py-4">
                    <div style={{ background: adminColors.surfaceHover }} className="h-4 rounded animate-pulse" />
                  </td>
                </tr>
              ))}

            {!loading && error && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center"
                  style={{ fontFamily: adminFonts.body, color: adminColors.danger, fontSize: 13.5 }}
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && submissions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center"
                  style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }}
                >
                  Aucune soumission ne correspond à ces critères.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              submissions.map((submission) => (
                <tr key={submission.id} style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                  {/* Title & Team */}
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
                        {submission.title}
                        {submission.demo_url && (
                          <a
                            href={submission.demo_url}
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

                      {/* Dynamic Team vs User check */}
                      <div
                        style={{
                          fontFamily: adminFonts.body,
                          color: adminColors.faint,
                          fontSize: 12,
                        }}
                        className="truncate flex items-center gap-1 mt-0.5"
                      >
                        {submission.team_id || submission.team_name ? (
                          <>
                            <Users size={12} className="shrink-0" />
                            <span>Équipe: {submission.team_name || "Sans nom"}</span>
                          </>
                        ) : (
                          <>
                            <User size={12} className="shrink-0" />
                            <span>
                              Auteur:{" "}
                              {submission.first_name || submission.last_name
                                ? `${submission.first_name || ""} ${submission.last_name || ""}`.trim()
                                : `@${submission.username}`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Hackathon */}
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                    {submission.hackathon_title}
                  </td>

                  {/* Status Badge */}
                 <td className="px-4 py-3">
                    {(() => {
                      const config = getStatusConfig(submission.evaluation_status, adminColors);
                      return (
                        <span
                          style={{
                            ...config.style,
                            fontFamily: adminFonts.body,
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        >
                          {config.icon} {config.label}
                        </span>
                      );
                    })()}
                  </td>

                  {/* Score */}
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5, fontWeight: 600 }}>
                    {submission.is_evaluated && submission.score !== undefined ? `${submission.score}/100` : "—"}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                    {new Date(submission.submitted_at).toLocaleDateString("fr-FR")}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`/myspace/submissions/${submission.id}`}
                        style={{ color: adminColors.muted }}
                        className="p-1.5 rounded-md hover:opacity-70"
                        aria-label="Voir la soumission"
                      >
                        <Eye size={15} />
                      </a>
                      <button
                        onClick={() => setDeletingSubmission(submission)}
                        style={{ color: adminColors.danger }}
                        className="p-1.5 rounded-md hover:opacity-70"
                        aria-label="Supprimer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap"
          style={{ borderTop: `1px solid ${adminColors.border}` }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>
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
            <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 12.5 }} className="px-2">
              {page} / {totalPages || 1}
            </span>
            <PageButton onClick={() => setPage(page + 1)} disabled={page === totalPages || totalPages === 0}>
              <ChevronRight size={15} />
            </PageButton>
            <PageButton onClick={() => setPage(totalPages)} disabled={page === totalPages || totalPages === 0}>
              <ChevronsRight size={15} />
            </PageButton>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deletingSubmission}
        title="Supprimer cette soumission ?"
        description={
          deletingSubmission
            ? `La soumission "${deletingSubmission.title}" de l'équipe ${deletingSubmission.team_name} sera définitivement supprimée.`
            : ""
        }
        confirmLabel="Supprimer"
        danger
        submitting={deleting}
        onCancel={() => setDeletingSubmission(null)}
        onConfirm={handleDelete}
      />
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
        className="flex items-center gap-1 hover:opacity-70"
      >
        {label}
        {active && (sortOrder === "asc" ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
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
      className="p-1.5 rounded-md hover:opacity-70 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}