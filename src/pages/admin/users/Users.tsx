// src/pages/admin/Users.tsx
import { useState, type ReactNode } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { adminColors, adminFonts, roleLabels } from "../../../theme/adminTokens";
import { useUsers } from "../../../hooks/useUsers";
import * as usersService from "../../../services/user.service";
import type { User } from "../../../api/user.api";
import UserFormModal, { type UserFormValues } from "./UserFormModal";
import ConfirmDialog from "./ConfirmDialog";

type SortableColumn = "username" | "email" | "role" | "created_at";

const ROLE_FILTERS: { value: User["role"] | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tous les rôles" },
  { value: "ADMIN", label: roleLabels.ADMIN },
  { value: "ORGANIZER", label: roleLabels.ORGANIZER },
  { value: "JUDGE", label: roleLabels.JUDGE },
  { value: "PARTICIPANT", label: roleLabels.PARTICIPANT },
];

const ALL_ROLES: User["role"][] = ["ADMIN", "ORGANIZER", "JUDGE", "PARTICIPANT"];
const PAGE_SIZE_OPTIONS = [10, 25, 50];

export default function Users() {
  const {
    users,
    total,
    totalPages,
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sortBy,
    sortOrder,
    toggleSort,
    loading,
    error,
    refetch,
  } = useUsers({ pageSize: 10 });

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [roleUpdatingId, setRoleUpdatingId] = useState<number | null>(null);

  function openCreate() {
    setFormMode("create");
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEdit(user: User) {
    setFormMode("edit");
    setEditingUser(user);
    setFormOpen(true);
  }

  async function handleSubmit(values: UserFormValues) {
    setSubmitting(true);
    try {
      if (formMode === "create") {
        await usersService.createUser({
          username: values.username,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password ?? "",
          role: values.role,
        });
      } else if (editingUser) {
        await usersService.updateUser(editingUser.id, {
          username: values.username,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
        });
        if (values.role !== editingUser.role) {
          await usersService.updateUserRole(editingUser.id, { role: values.role });
        }
      }
      setFormOpen(false);
      refetch();
    } catch (err) {
      // TODO: surface this through the app's toast/notification system
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingUser) return;
    setDeleting(true);
    try {
      await usersService.deleteUser(deletingUser.id);
      setDeletingUser(null);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  }

  async function handleQuickRoleChange(user: User, role: User["role"]) {
    if (role === user.role) return;
    setRoleUpdatingId(user.id);
    try {
      await usersService.updateUserRole(user.id, { role });
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setRoleUpdatingId(null);
    }
  }

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 22 }}>
            Utilisateurs
          </h1>
          <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }} className="mt-0.5">
            {total} utilisateur{total > 1 ? "s" : ""} au total
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{ fontFamily: adminFonts.body, color: "#fff", background: adminColors.accent, fontSize: 13.5 }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-md font-medium hover:opacity-90"
        >
          <Plus size={16} /> Ajouter un utilisateur
        </button>
      </div>

      {/* toolbar: search + role filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
          className="flex items-center gap-2 rounded-md px-3 py-2.5 flex-1 min-w-[220px] max-w-sm"
        >
          <Search size={15} color={adminColors.faint} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email…"
            style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13.5 }}
            className="bg-transparent outline-none w-full placeholder:opacity-60"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as User["role"] | "ALL")}
          style={{
            fontFamily: adminFonts.body,
            color: adminColors.text,
            border: `1px solid ${adminColors.border}`,
            background: adminColors.surface,
          }}
          className="rounded-md px-3 py-2.5 text-sm outline-none"
        >
          {ROLE_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* table */}
      <div
        style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
        className="rounded-xl overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: `1px solid ${adminColors.border}` }}>
              <SortableHeader label="Utilisateur" column="username" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <SortableHeader label="Email" column="email" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <SortableHeader label="Rôle" column="role" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
              <SortableHeader label="Créé le" column="created_at" sortBy={sortBy} sortOrder={sortOrder} onSort={toggleSort} />
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
                  <td colSpan={5} className="px-4 py-4">
                    <div style={{ background: adminColors.surfaceHover }} className="h-4 rounded animate-pulse" />
                  </td>
                </tr>
              ))}

            {!loading && error && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center"
                  style={{ fontFamily: adminFonts.body, color: adminColors.danger, fontSize: 13.5 }}
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center"
                  style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13.5 }}
                >
                  Aucun utilisateur ne correspond à cette recherche.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              users.map((user) => (
                <tr key={user.id} style={{ borderBottom: `1px solid ${adminColors.border}` }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        style={{ background: adminColors.accentSoft, color: adminColors.accentText }}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                      >
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </div>
                      <div className="min-w-0">
                        <div
                          style={{ fontFamily: adminFonts.body, color: adminColors.text, fontWeight: 600, fontSize: 13.5 }}
                          className="truncate"
                        >
                          {user.first_name} {user.last_name}
                        </div>
                        <div
                          style={{ fontFamily: adminFonts.body, color: adminColors.faint, fontSize: 12 }}
                          className="truncate"
                        >
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <select
                    id={`role-select-${user.id}`}
                      value={user.role}
                      disabled={roleUpdatingId === user.id}
                      onChange={(e) => handleQuickRoleChange(user, e.target.value as User["role"])}
                      style={{
                        fontFamily: adminFonts.body,
                        fontSize: 12.5,
                        border: "none",
                        background: "transparent",
                        color: adminColors.text,
                      }}
                      className="outline-none cursor-pointer"
                    >
                      {ALL_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {roleLabels[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 13 }}>
                    {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(user)}
                        style={{ color: adminColors.muted }}
                        className="p-1.5 rounded-md hover:opacity-70"
                        aria-label="Modifier"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeletingUser(user)}
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

        {/* pagination footer */}
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

      <UserFormModal
        open={formOpen}
        mode={formMode}
        initialUser={editingUser}
        submitting={submitting}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!deletingUser}
        title="Supprimer cet utilisateur ?"
        description={
          deletingUser
            ? `${deletingUser.first_name} ${deletingUser.last_name} sera définitivement supprimé. Cette action est irréversible.`
            : ""
        }
        confirmLabel="Supprimer"
        danger
        submitting={deleting}
        onCancel={() => setDeletingUser(null)}
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