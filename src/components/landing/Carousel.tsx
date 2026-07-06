import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";
import type { CarouselSlide } from "../../types/hackathon";

// Placeholder imagery — swap these seeded URLs for real event photos later.
const DEFAULT_SLIDES: CarouselSlide[] = [
  { seed: "hackathon-code-1", caption: "Nuit de code — équipes en pleine sprint", tag: "Développement" },
  { seed: "hackathon-team-2", caption: "Brainstorm d'équipe avant le pitch final", tag: "Collaboration" },
  { seed: "hackathon-jury-3", caption: "Présentation devant le jury", tag: "Finale" },
  { seed: "hackathon-award-4", caption: "Remise des prix — édition 2025", tag: "Cérémonie" },
  { seed: "hackathon-crowd-5", caption: "168 participants, une seule communauté", tag: "Ambiance" },
];

interface CarouselProps {
  slides?: CarouselSlide[];
  onParticipate?: () => void;
  autoPlayMs?: number;
}

export default function Carousel({ slides = DEFAULT_SLIDES, onParticipate, autoPlayMs = 4500 }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), autoPlayMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [slides.length, autoPlayMs]);

  const go = (next: number) => {
    if (timer.current) clearInterval(timer.current);
    setIndex((next + slides.length) % slides.length);
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), autoPlayMs);
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/8", border: `1px solid ${colors.border}` }}>
      <div
        className="flex h-full"
        style={{
          width: `${slides.length * 100}%`,
          transform: `translateX(-${index * (100 / slides.length)}%)`,
          transition: "transform 600ms ease",
        }}
      >
        {slides.map((s) => (
          <div key={s.seed} className="relative h-full" style={{ width: `${100 / slides.length}%` }}>
            <img src={`https://picsum.photos/seed/${s.seed}/1400/700`} alt={s.caption} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,22,43,0) 40%, rgba(20,22,43,0.75) 100%)" }} />
            <div className="absolute left-6 bottom-6 right-6 flex items-end justify-between gap-4">
              <div>
                <span
                  style={{ fontFamily: fonts.body, color: "#fff", fontSize: 11, fontWeight: 500, background: "rgba(255,255,255,0.18)" }}
                  className="px-2.5 py-1 rounded-full backdrop-blur-sm"
                >
                  {s.tag}
                </span>
                <p style={{ fontFamily: fonts.heading, color: "#fff", fontSize: 18, fontWeight: 700 }} className="mt-2 max-w-md">
                  {s.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => go(index - 1)}
        aria-label="Précédent"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 items-center justify-center rounded-full hover:bg-white"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,0.85)", color: colors.text }}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Suivant"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 items-center justify-center rounded-full hover:bg-white"
        style={{ width: 36, height: 36, background: "rgba(255,255,255,0.85)", color: colors.text }}
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute top-5 right-5">
        <button
          onClick={onParticipate}
          style={{ fontFamily: fonts.body, color: colors.text, background: "#fff", fontWeight: 500, fontSize: 13 }}
          className="px-4 py-2.5 rounded-full flex items-center gap-2 shadow-sm hover:opacity-90"
        >
          Participer maintenant <ArrowRight size={14} />
        </button>
      </div>

      <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.seed}
            onClick={() => go(i)}
            aria-label={`Aller à la diapositive ${i + 1}`}
            className="rounded-full"
            style={{ width: i === index ? 18 : 6, height: 6, background: i === index ? "#fff" : "rgba(255,255,255,0.5)", transition: "width 300ms ease" }}
          />
        ))}
      </div>
    </div>
  );
}
