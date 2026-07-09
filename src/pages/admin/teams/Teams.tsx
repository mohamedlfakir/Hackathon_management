// src/pages/admin/Teams.tsx
import { useState, type ReactNode } from "react";
import {
  Search,
  Plus,
  Trash2,
  Eye,
  Crown,
  Users as UsersIcon,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { adminColors, adminFonts } from "../../../theme/adminTokens";
import { useTeams } from "../../../hooks/useTeams"; // Supposant que vous avez un hook similaire à useUsers
import * as teamsService from "../../../services/team.service";
import ConfirmDialog from "./ConfirmDialog";

// Types basés sur vos besoins
export interface TeamMember {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Team {
  id: number;
  name: string;
  avatar_url?: string | null;
  hackathon_title: string;
  leader: TeamMember;
  members: TeamMember[];
  created_at: string;
}

type SortableColumn = "name" | "hackathon_title" | "created_at";
const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function Teams() {
  const {
    teams,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch,
  } = useTeams({ pageSize: 10 });

  // États pour les modals
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [deleting, setDeleting] = useState(false);

  function openDetails(team: Team) {
    setSelectedTeam(team);
    setDetailsOpen(true);
  }

  async function handleDelete() {
    if (!deletingTeam) return;
    setDeleting(true);
    try {
      await teamsService.deleteTeam(deletingTeam.id);
      setDeletingTeam(null);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 22 }}>
            Équipes
          </h1>
          <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }} className="mt-0.5">
            {total} équipe{total > 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          style={{ fontFamily: adminFonts.body, color: "#fff", background: adminColors.accent, fontSize: 13.5 }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium hover:opacity-90"
        >
          <Plus size={16} /> Créer une équipe
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 flex-1 min-w-[220px] max-w-sm"
        >
          <Search size={15} color={adminColors.faint} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une équipe, un hackathon…"
            style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5 }}
            className="bg-transparent outline-none w-full placeholder:opacity-60"
          />
        </div>
      </div>

      {/* Table */}
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="rounded-xl overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${adminColors.border}` }}>
              <SortableHeader label="Équipe" column="name" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <SortableHeader label="Hackathon" column="hackathon_title" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <th className="px-4 py-3 text-left" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>
                Leader
              </th>
              <th className="px-4 py-3 text-left" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>
                Membres
              </th>
              <SortableHeader label="Créée le" column="created_at" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <th className="px-4 py-3 text-right" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>
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
                <td colSpan={6} className="px-4 py-10 text-center" style={{ fontFamily: adminFonts.body, color: adminColors.danger, fontSize: 13.5 }}>
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && teams.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }}>
                  Aucune équipe ne correspond à cette recherche.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              teams.map((team) => (
                <tr 
                  key={team.id} 
                  style={{ borderBottom: `1px solid ${adminColors.border}`, backgroundColor: "transparent" }}
                  className="hover:bg-opacity-40 transition-colors"
                >
                  {/* Équipe Nom + Avatar */}
                  <td className="px-4 py-3 cursor-pointer" onClick={() => openDetails(team)}>
                    <div className="flex items-center gap-2.5">
                      {team.avatar_url ? (
                        <img src={team.avatar_url} alt={team.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div
                          style={{ background: adminColors.accentSoft, color: adminColors.accentText }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 uppercase"
                        >
                          {team.name.substring(0, 2)}
                        </div>
                      )}
                      <div style={{ fontFamily: adminFonts.body, color: adminColors.text, fontWeight: 600, fontSize: 13.5 }} className="truncate">
                        {team.name}
                      </div>
                    </div>
                  </td>

                  {/* Hackathon */}
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5 }}>
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                      {team.hackathon_title}
                    </span>
                  </td>

                  {/* Leader */}
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                    <div className="flex items-center gap-1.5">
                      <Crown size={14} className="text-amber-500 shrink-0" />
                      <span className="truncate">{team.leader.first_name} {team.leader.last_name}</span>
                    </div>
                  </td>

                  {/* Nombre de membres */}
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                    <div className="flex items-center gap-1.5">
                      <UsersIcon size={14} color={adminColors.faint} />
                      <span>{team.members.length} membre{team.members.length > 1 ? "s" : ""}</span>
                    </div>
                  </td>

                  {/* Date de création */}
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                    {new Date(team.created_at).toLocaleDateString("fr-FR")}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openDetails(team)}
                        style={{ color: adminColors.muted }}
                        className="p-1.5 rounded-md hover:opacity-70"
                        aria-label="Voir les détails"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => setDeletingTeam(team)}
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
        <div className="flex items-center justify-between gap-3 px-4 py-3 flex-wrap" style={{ borderTop: `1px solid ${adminColors.border}` }}>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }}>
              {from}–{to} sur {total}
            </span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              style={{ fontFamily: adminFonts.body, color: adminColors.text, border: `1px solid ${adminColors.border}`, fontSize: 12.5 }}
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
              {page} / {totalPages}
            </span>
            <PageButton onClick={() => setPage(page + 1)} disabled={page === totalPages}>
              <ChevronRight size={15} />
            </PageButton>
            <PageButton onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              <ChevronsRight size={15} />
            </PageButton>
          </div>
        </div>
      </div>

      {/* Modal de détails de l'équipe */}
      <TeamDetailsModal open={detailsOpen} team={selectedTeam} onClose={() => setDetailsOpen(false)} />

      {/* Modal de confirmation de suppression */}
      <ConfirmDialog
        open={!!deletingTeam}
        title="Supprimer cette équipe ?"
        description={deletingTeam ? `L'équipe "${deletingTeam.name}" sera définitivement supprimée. Cette action est irréversible.` : ""}
        confirmLabel="Supprimer"
        danger
        submitting={deleting}
        onCancel={() => setDeletingTeam(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

/* --- COMPOSANTS AUXILIAIRES INTERNES --- */

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

function PageButton({ children, onClick, disabled }: { children: ReactNode; onClick: () => void; disabled?: boolean }) {
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

// Composant Modal pour afficher les membres et le leader
function TeamDetailsModal({ open, team, onClose }: { open: boolean; team: Team | null; onClose: () => void }) {
  if (!open || !team) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="w-full max-w-lg rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: adminColors.border }}>
          <div className="flex items-center gap-3">
            {team.avatar_url ? (
              <img src={team.avatar_url} alt={team.name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div
                style={{ background: adminColors.accentSoft, color: adminColors.accentText }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold uppercase"
              >
                {team.name.substring(0, 2)}
              </div>
            )}
            <div>
              <h2 style={{ fontFamily: adminFonts.heading, color: adminColors.text }} className="text-base font-bold">
                {team.name}
              </h2>
              <p style={{ fontFamily: adminFonts.body, color: adminColors.faint }} className="text-xs">
                Inscrite au hackathon : <span className="font-semibold text-slate-600">{team.hackathon_title}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: adminColors.muted }} className="p-1.5 rounded-md hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: adminFonts.body, color: adminColors.faint }}>
            Membres de l'équipe ({team.members.length})
          </div>

          <div className="flex flex-col gap-2.5">
            {team.members.map((member) => {
              const isLeader = member.id === team.leader.id;
              return (
                <div
                  key={member.id}
                  style={{ 
                    border: `1px solid ${isLeader ? adminColors.accent : adminColors.border}`,
                    background: isLeader ? adminColors.accentSoft : 'transparent' 
                  }}
                  className="flex items-center justify-between p-3 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      style={{ 
                        background: isLeader ? adminColors.accent : adminColors.border, 
                        color: isLeader ? '#fff' : adminColors.text 
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 uppercase"
                    >
                      {member.first_name[0]}{member.last_name[0]}
                    </div>
                    <div className="min-w-0">
                      <div style={{ fontFamily: adminFonts.body, color: adminColors.text }} className="text-sm font-medium truncate">
                        {member.first_name} {member.last_name}
                      </div>
                      <div style={{ fontFamily: adminFonts.body, color: adminColors.muted }} className="text-xs truncate">
                        @{member.username} • {member.email}
                      </div>
                    </div>
                  </div>

                  {isLeader && (
                    <span 
                      style={{ background: adminColors.accent, color: '#fff', fontFamily: adminFonts.body }} 
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide shrink-0 shadow-sm"
                    >
                      <Crown size={11} /> LEADER
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t flex justify-end" style={{ borderColor: adminColors.border }}>
          <button
            onClick={onClose}
            style={{ fontFamily: adminFonts.body, border: `1px solid ${adminColors.border}`, color: adminColors.text }}
            className="px-4 py-2 bg-white rounded-md text-xs font-medium hover:bg-slate-100 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}