// src/layouts/PublicLayout.tsx
import { Outlet } from 'react-router-dom';
import {  Sparkles } from "lucide-react";
import { colors, fonts } from "../theme/tokens";

export default function PublicLayout() {
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

        </div> 
     
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