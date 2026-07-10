// src/components/admin/Sidebar.tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Users,
  FolderKanban,
  ClipboardCheck,
  UserCog,
  Settings,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,    
} from "lucide-react";
import { adminColors, adminFonts, roleLabels } from "../../theme/adminTokens";
import { useAuth } from "../../contexts/AuthContext";

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  roles: string[];
  end?: boolean;
}

// Single source of truth for the console's navigation. Add a page once here
// and it shows up for every role that should see it.
const NAV_ITEMS: NavItem[] = [
  { label: "Tableau de bord", path: "/myspace", icon: LayoutDashboard, roles: ["ADMIN", "ORGANIZER", "JUDGE", "PARTICIPANT"], end: true },
  { label: "Hackathons", path: "/myspace/hackathons", icon: Trophy, roles: ["ADMIN", "ORGANIZER", "PARTICIPANT","JUDGE"] },
  { label: "Équipes", path: "/myspace/teams", icon: Users, roles: ["ADMIN", "ORGANIZER"] },
  { label: "Soumissions", path: "/myspace/submissions", icon: FolderKanban, roles: ["ADMIN", "ORGANIZER", "JUDGE", "PARTICIPANT"] },
  { label: "Évaluations", path: "/myspace/evaluations", icon: ClipboardCheck, roles: ["ADMIN", "ORGANIZER", "JUDGE"] },
  { label: "Utilisateurs", path: "/myspace/users", icon: UserCog, roles: ["ADMIN"] },
];

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const { user, loading } = useAuth();
  const items = NAV_ITEMS.filter((i) => i.roles.includes(user!.role));
  return (
    <>
      {/* mobile scrim */}
      {mobileOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onCloseMobile} />}

      <aside
        style={{
          background: adminColors.surface,
          borderRight: `1px solid ${adminColors.border}`,
          width: collapsed ? 76 : 248,
        }}
        className={`fixed md:sticky top-0 h-screen z-50 flex flex-col shrink-0 transition-all duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* logo */}
        <div
          className="flex items-center gap-2 px-4 shrink-0"
          style={{ height: 64, borderBottom: `1px solid ${adminColors.border}` }}
        >
          <div
            className="rounded-md flex items-center justify-center shrink-0"
            style={{ width: 30, height: 30, background: adminColors.accent }}
          >
            <Sparkles size={16} color="#fff" />
          </div>
          {!collapsed && (
            <span
              style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 16 }}
              className="truncate"
            >
              Hackathon<span style={{ color: adminColors.accent }}>Manager</span>
            </span>
          )}
        </div>

        {/* current role badge */}
        {!collapsed && (
          <div className="px-4 pt-4">
            <span
              style={{
                fontFamily: adminFonts.body,
                color: adminColors.accentText,
                background: adminColors.accentSoft,
                fontSize: 12,
                fontWeight: 600,
              }}
              className="px-2.5 py-1 rounded-full"
            >
              {roleLabels[user!.role]}
            </span>
          </div>
        )}

        {/* nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          {items.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onCloseMobile}
              className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors ${
                collapsed ? "justify-center" : ""
              }`}
              style={({ isActive }) => ({
                background: isActive ? adminColors.accentSoft : "transparent",
                color: isActive ? adminColors.accentText : adminColors.muted,
              })}
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <span
                    style={{ background: isActive ? adminColors.accent : "transparent" }}
                    className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                  />
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                  {!collapsed && (
                    <span
                      style={{ fontFamily: adminFonts.body, fontSize: 14, fontWeight: isActive ? 600 : 500 }}
                      className="truncate"
                    >
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* collapse toggle — desktop only, mobile closes via the scrim/X instead */}
        <button
          onClick={onToggle}
          style={{ borderTop: `1px solid ${adminColors.border}`, color: adminColors.muted, fontFamily: adminFonts.body }}
          className="hidden md:flex items-center gap-2 px-4 py-3.5 text-sm hover:opacity-70"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && "Réduire"}
        </button>
      </aside>
    </>
  );
}