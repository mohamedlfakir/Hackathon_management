// src/pages/admin/Hackathons.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, MapPin, Calendar, Users as UsersIcon, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { adminColors, adminFonts } from "../../../theme/adminTokens";
import { useHackathons, type HackathonSortBy } from "../../../hooks/useHackathons";
import * as hackathonsService from "../../../services/hackathon.service";
import StatusBadge from "./StatusBadge";
import HackathonFormModal, { type HackathonFormValues } from "./HackathonFormModal";    

const STATUS_FILTERS = ["ALL", "OPEN", "CLOSED", "FINISHED", "UPCOMING"];

const SORT_OPTIONS: { value: HackathonSortBy; label: string }[] = [
  { value: "start_date", label: "Date de début" },
  { value: "title", label: "Titre" },
  { value: "registration_deadline", label: "Date limite d'inscription" },
  { value: "status", label: "Statut" },
];

export default function Hackathons() {
  const navigate = useNavigate();
  const {
    hackathons,
    total,
    totalPages,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch,
  } = useHackathons({ pageSize: 9 });

  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(values: HackathonFormValues) {
    setSubmitting(true);
    try {
      await hackathonsService.createHackathon({
        title: values.title,
        description: values.description,
        theme: values.theme,
        start_date: values.start_date,
        end_date: values.end_date,
        registration_deadline: values.registration_deadline,
        max_team_size: values.max_team_size,
        rules: values.rules,
        location: values.location,
        is_online: values.is_online,
      });
      setFormOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 22 }}>
            Hackathons
          </h1>
          <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }} className="mt-0.5">
            {total} hackathon{total > 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          style={{ fontFamily: adminFonts.body, color: "#fff", background: adminColors.accent, fontSize: 13.5 }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium hover:opacity-90"
        >
          <Plus size={16} /> Créer un hackathon
        </button>
      </div>

      {/* toolbar: search, status filter, sort */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 flex-1 min-w-[220px] max-w-sm"
        >
          <Search size={15} color={adminColors.faint} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un hackathon…"
            style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5 }}
            className="bg-transparent outline-none w-full placeholder:opacity-60"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            fontFamily: adminFonts.body,
            color: adminColors.text,
            border: `1px solid ${adminColors.border}`,
            background: adminColors.surface,
          }}
          className="rounded-md px-3 py-2.5 text-sm outline-none"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s} value={s}>
              {s === "ALL" ? "Tous les statuts" : s}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1">
          <select
            value={sortBy}
            onChange={(e) => toggleSort(e.target.value as HackathonSortBy)}
            style={{
              fontFamily: adminFonts.body,
              color: adminColors.text,
              border: `1px solid ${adminColors.border}`,
              background: adminColors.surface,
            }}
            className="rounded-md px-3 py-2.5 text-sm outline-none"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => toggleSort(sortBy)}
            style={{ color: adminColors.muted, border: `1px solid ${adminColors.border}` }}
            className="p-2.5 rounded-md hover:opacity-70"
            aria-label="Inverser l'ordre de tri"
          >
            {sortOrder === "asc" ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
              className="rounded-xl p-4 h-40 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div style={{ fontFamily: adminFonts.body, color: adminColors.danger, fontSize: 13.5 }} className="text-center py-10">
          {error}
        </div>
      )}

      {!loading && !error && hackathons.length === 0 && (
        <div style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }} className="text-center py-10">
          Aucun hackathon ne correspond à cette recherche.
        </div>
      )}

      {!loading && !error && hackathons.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hackathons.map((h) => (
            <button
              key={h.id}
              onClick={() => navigate(`/myspace/hackathons/${h.id}`)}
              style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
              className="text-left rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 15 }}
                  className="line-clamp-2"
                >
                  {h.title}
                </span>
                <StatusBadge status={ h.status } />
              </div>
              <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }} className="line-clamp-2">
                {h.description}
              </p>
              <div className="flex flex-col gap-1.5 mt-auto pt-1">
                <div className="flex items-center gap-1.5" style={{ color: adminColors.faint }}>
                  <Calendar size={13} />
                  <span style={{ fontFamily: adminFonts.body, fontSize: 12 }}>
                    {new Date(h.start_date).toLocaleDateString("fr-FR")} → {new Date(h.end_date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: adminColors.faint }}>
                  <MapPin size={13} />
                  <span style={{ fontFamily: adminFonts.body, fontSize: 12 }}>
                    {h.is_online ? "En ligne" : h.location || "Lieu à définir"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5" style={{ color: adminColors.faint }}>
                  <UsersIcon size={13} />
                  <span style={{ fontFamily: adminFonts.body, fontSize: 12 }}>Équipes de {h.max_team_size} max.</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && !error && total > 0 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            style={{ color: adminColors.muted, opacity: page === 1 ? 0.35 : 1 }}
            className="p-1.5 rounded-md hover:opacity-70"
          >
            <ChevronLeft size={15} />
          </button>
          <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 12.5 }} className="px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            style={{ color: adminColors.muted, opacity: page === totalPages ? 0.35 : 1 }}
            className="p-1.5 rounded-md hover:opacity-70"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      <HackathonFormModal
        open={formOpen}
        mode="create"
        submitting={submitting}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}