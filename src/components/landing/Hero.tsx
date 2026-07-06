import { ArrowRight } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";
import Carousel from "./Carousel";

interface HeroProps {
  onExplore?: () => void;
  onViewProjects?: () => void;
}

export default function Hero({ onExplore, onViewProjects }: HeroProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-10 pb-16">
      <Carousel onParticipate={onExplore} />
      <div className="text-center flex flex-col items-center mt-12">
        <span
          style={{ fontFamily: fonts.body, color: colors.accent, background: colors.accentSoft, fontSize: 13, fontWeight: 500 }}
          className="px-3 py-1.5 rounded-full"
        >
          Prochain hackathon dans 4 jours
        </span>
        <h1
          style={{ fontFamily: fonts.heading, color: colors.text, fontWeight: 700, fontSize: "clamp(30px, 4.6vw, 48px)", lineHeight: 1.15 }}
          className="mt-6 max-w-2xl"
        >
          Trouvez votre équipe. Construisez votre idée. Présentez-la au monde.
        </h1>
        <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 17 }} className="mt-5 max-w-xl">
          Des hackathons en présentiel et en ligne, ouverts à tous les niveaux.
          Rejoignez-en un, formez une équipe, et voyez votre projet prendre vie en 48h.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-9">
          <button
            onClick={onExplore}
            style={{ fontFamily: fonts.body, color: "#fff", background: colors.accent, fontWeight: 500, fontSize: 15 }}
            className="px-6 py-3 rounded-md flex items-center justify-center gap-2 hover:opacity-90"
          >
            Explorer les hackathons <ArrowRight size={16} />
          </button>
          <button
            onClick={onViewProjects}
            style={{ fontFamily: fonts.body, color: colors.text, border: `1px solid ${colors.border}`, fontSize: 15 }}
            className="px-6 py-3 rounded-md hover:bg-gray-50"
          >
            Voir les projets réalisés
          </button>
        </div>
      </div>
    </section>
  );
}
