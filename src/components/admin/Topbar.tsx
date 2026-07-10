// src/components/admin/Topbar.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, ChevronRight, LogOut, User, Settings,Home } from "lucide-react";
import { adminColors, adminFonts, roleLabels } from "../../theme/adminTokens";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Maps a URL segment to its display label. Extend this as new routes are added.
const SEGMENT_LABELS: Record<string, string> = {
  admin: "Tableau de bord",
  hackathons: "Hackathons",
  teams: "Équipes",
  submissions: "Soumissions",
  evaluations: "Évaluations",
  users: "Utilisateurs",
  settings: "Paramètres",
};

  
function Breadcrumbs() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <div className="hidden sm:flex items-center gap-1.5 min-w-0">
      {segments.map((seg, i) => {
        const path = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = SEGMENT_LABELS[seg] ?? seg;
        return (
          <span key={path} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <ChevronRight size={13} color={adminColors.faint} />}
            {isLast ? (
              <span
                style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 600, fontSize: 15 }}
                className="truncate"
              >
                {label}
              </span>
            ) : (
              <Link
                to={path}
                style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 14 }}
                className="hover:opacity-70 truncate"
              >
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}

// Mock data — swap for a real notifications query when the API is ready.
const NOTIFICATIONS = [
  { id: 1, title: "Nouvelle soumission", detail: "L'équipe Nova Byte a soumis son projet.", time: "5 min" },
  { id: 2, title: "Évaluation à faire", detail: "3 soumissions attendent votre note.", time: "1 h" },
  { id: 3, title: "Hackathon publié", detail: '"AI for Good" est maintenant visible.', time: "hier" },
];

function useClickOutside<T extends HTMLElement>(onOutside: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ color: adminColors.muted, border: `1px solid ${adminColors.border}` }}
        className="relative w-9 h-9 rounded-md flex items-center justify-center hover:opacity-70"
        aria-label="Notifications"
      >
        <Bell size={17} />
        {NOTIFICATIONS.length > 0 && (
          <span
            style={{ background: adminColors.danger }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] text-white flex items-center justify-center"
          >
            {NOTIFICATIONS.length}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
          className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden z-50"
        >
          <div className="px-4 py-3" style={{ borderBottom: `1px solid ${adminColors.border}` }}>
            <span style={{ fontFamily: adminFonts.heading, color: adminColors.text, fontWeight: 700, fontSize: 14 }}>
              Notifications
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                className="px-4 py-3 hover:opacity-80 cursor-pointer"
                style={{ borderBottom: `1px solid ${adminColors.border}` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontWeight: 600, fontSize: 13 }}>
                    {n.title}
                  </span>
                  <span style={{ fontFamily: adminFonts.body, color: adminColors.faint, fontSize: 11 }} className="shrink-0">
                    {n.time}
                  </span>
                </div>
                <p style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 12.5 }} className="mt-0.5">
                  {n.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Optionnel : rediriger l'utilisateur ou afficher une notification ici
    } catch (error) {
      console.error("Échec de la déconnexion", error);
    }
  };
   const navigate = useNavigate();
   return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 hover:opacity-70">
        <div
          style={{ background: adminColors.accentSoft, color: adminColors.accentText }}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
        >
            {user?.first_name ? user.first_name[0].toUpperCase() : "?"}{user?.last_name ? user.last_name[0].toUpperCase() : "?"}
        </div>
        <div className="hidden lg:flex flex-col items-start leading-tight">
          <span style={{ fontFamily: adminFonts.body, color: adminColors.text, fontSize: 13, fontWeight: 600 }}>
            {user!.first_name} {user!.last_name} 
          </span>
          <span style={{ fontFamily: adminFonts.body, color: adminColors.muted, fontSize: 11.5 }}>
            {roleLabels[user!.role]}
          </span>
        </div>
        <ChevronDown size={14} color={adminColors.muted} />
      </button>

      {open && (
        <div
          style={{ background: adminColors.surface, border: `1px solid ${adminColors.border}` }}
          className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg overflow-hidden z-50"
        >
          <button onClick={() => navigate(`/myspace/profil`)} 
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:opacity-70"
            style={{ color: adminColors.text, fontFamily: adminFonts.body, fontSize: 13.5 }}
          >
            <User size={15} /> Mon profil
          </button>

          <button onClick={() => {handleLogout(); setOpen(false)}}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:opacity-70"
            style={{ color: adminColors.danger, fontFamily: adminFonts.body, fontSize: 13.5, borderTop: `1px solid ${adminColors.border}` }}
          >
            <LogOut size={15} /> Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}

export default function Topbar({ onOpenMobileSidebar }: { onOpenMobileSidebar: () => void }) {
 
  return (
    <header
      style={{ background: adminColors.surface, borderBottom: `1px solid ${adminColors.border}` }}
      className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-6"
    >
      <div style={{ height: 64 }} className="flex items-center gap-4 min-w-0 flex-1">
        <button onClick={onOpenMobileSidebar} className="md:hidden" style={{ color: adminColors.text }} aria-label="Ouvrir le menu">
          <Menu size={22} />
        </button>
        <Breadcrumbs />
      </div>

      

      <div className="flex items-center gap-3 shrink-0">
        
        <div style={{ width: 1, height: 24, background: adminColors.border }} className="hidden sm:block" />
        <ProfileMenu />
      </div>
    </header>
  );
}