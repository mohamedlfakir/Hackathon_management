import { useEffect, useState } from "react";
import { Sparkles, Quote, Users, Trophy, Code2 } from "lucide-react";
import { colors, fonts, gradients } from "../../theme/tokens";
import type { AuthTestimonial, AuthStatBadge } from "../../types/auth";
import Blob from "./Blob";

const TESTIMONIALS: AuthTestimonial[] = [
  { text: "On est arrivés sans savoir coder ensemble, et repartis avec un vrai produit.", author: "Yasmine B. — équipe MediLink" },
  { text: "48h, une idée floue, et une équipe géniale. On a fini 2e et on recommence.", author: "Karim T. — équipe EcoRoute" },
  { text: "Le meilleur moyen d'apprendre vite : construire sous pression, avec les bonnes personnes.", author: "Sara L. — équipe SafeRoute" },
];

const STATS: AuthStatBadge[] = [
  { icon: Users, value: "5 000+", label: "participants" },
  { icon: Trophy, value: "120+", label: "hackathons" },
  { icon: Code2, value: "800+", label: "projets" },
];

export default function ShowcasePanel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden h-full flex flex-col justify-between p-10 xl:p-14" style={{ background: gradients.authShowcase }}>
      <Blob size={280} color="#FF9CE3" top="-60px" left="60%" />
      <Blob size={220} color="#7DE8C6" top="55%" left="-60px" delay={1.5} />
      <Blob size={180} color="#FFD166" top="10%" left="-40px" delay={3} />

      <div className="relative z-10 flex items-center gap-2">
        <div className="rounded-md flex items-center justify-center" style={{ width: 32, height: 32, background: "rgba(255,255,255,0.2)" }}>
          <Sparkles size={16} color="#fff" />
        </div>
        <span style={{ fontFamily: fonts.heading, color: "#fff", fontWeight: 700, fontSize: 18 }}>Hackathon Manager</span>
      </div>

      <div className="relative z-10">
        <h2 style={{ fontFamily: fonts.heading, color: "#fff", fontSize: "clamp(26px, 2.6vw, 34px)", fontWeight: 700, lineHeight: 1.25 }} className="max-w-md">
          Là où les idées prennent vie en 48h.
        </h2>

        <div key={i} className="fade-in mt-8 max-w-md">
          <Quote size={22} color="rgba(255,255,255,0.85)" />
          <p style={{ fontFamily: fonts.body, color: "#fff", fontSize: 16, lineHeight: 1.6 }} className="mt-3">
            {TESTIMONIALS[i].text}
          </p>
          <p style={{ fontFamily: fonts.body, color: "rgba(255,255,255,0.75)", fontSize: 13 }} className="mt-3">
            {TESTIMONIALS[i].author}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap gap-3">
        {STATS.map((s) => (
          <div key={s.label} className="flex items-center gap-2.5 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(6px)" }}>
            <s.icon size={16} color="#fff" />
            <div>
              <p style={{ fontFamily: fonts.heading, color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontFamily: fonts.body, color: "rgba(255,255,255,0.75)", fontSize: 11 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
