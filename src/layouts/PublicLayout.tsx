// src/layouts/PublicLayout.tsx
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Sparkles } from "lucide-react";
import { colors, fonts } from "../theme/tokens";

const NAV_LINKS = ["Hackathons", "Comment ça marche", "Projets"] as const;
export default function PublicLayout() {
    const [open, setOpen] = useState(false);
  return (
    <div>
    <header
      style={{ borderBottom: `1px solid ${colors.border}`, background: colors.bg }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div
            className="rounded-md flex items-center justify-center"
            style={{ width: 30, height: 30, background: colors.accent }}
          >
            <Sparkles size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: fonts.heading, color: colors.text, fontWeight: 700, fontSize: 17 }}>
            Hackathon<span style={{ color: colors.accent }}>Manager</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14 }} className="hover:opacity-70">
              {l}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={() => (window.location.href = "/login")} style={{ fontFamily: fonts.body, color: colors.text, fontSize: 14 }} className="px-4 py-2 hover:opacity-70">
            Se connecter
          </button>
          <button
            onClick={() => (window.location.href = "/register")}
            style={{ fontFamily: fonts.body, color: "#fff", background: colors.accent, fontWeight: 500, fontSize: 14 }}
            className="px-4 py-2 rounded-md hover:opacity-90"
          >
            S'inscrire
          </button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} style={{ color: colors.text }} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4" style={{ borderTop: `1px solid ${colors.border}` }}>
          {NAV_LINKS.map((l) => (
            <a key={l} href="#" style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14 }}>
              {l}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={() => (window.location.href = "/login")}
              style={{ fontFamily: fonts.body, color: colors.text, fontSize: 14, border: `1px solid ${colors.border}` }}
              className="px-4 py-2 rounded-md flex-1"
            >
              Se connecter
            </button>
            <button onClick={() => (window.location.href = "/register")}
              style={{ fontFamily: fonts.body, color: "#fff", background: colors.accent, fontWeight: 500, fontSize: 14 }}
              className="px-4 py-2 rounded-md flex-1"
            >
              S'inscrire
            </button>
          </div>
        </div>
      )}
    </header>
    
      {/* Dynamic Page Content */}
      <main className="flex-grow " >
        <Outlet />
      </main>

      {/* Rich Footer */}
      <footer style={{ borderTop: `1px solid ${colors.border}` }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} color={colors.accent} />
          <span style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 14, fontWeight: 700 }}>Hackathon Manager</span>
        </div>
        <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 13 }}>© 2026 Hackathon Manager. Tous droits réservés.</p>
      </div>
    </footer>
    </div>
  );
}