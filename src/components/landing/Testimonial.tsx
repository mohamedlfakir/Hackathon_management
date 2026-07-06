import { Quote } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";

interface TestimonialProps {
  quote?: string;
  authorInitials?: string;
  authorName?: string;
  authorContext?: string;
}

export default function Testimonial({
  quote = "On est arrivés sans savoir coder ensemble, et repartis avec un vrai produit et une équipe qu'on garde encore aujourd'hui.",
  authorInitials = "YB",
  authorName = "Yasmine B.",
  authorContext = "Équipe MediLink — 1ère place, édition 2025",
}: TestimonialProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="rounded-2xl p-8 md:p-12 flex flex-col items-center text-center" style={{ background: colors.accentSoft }}>
        <Quote size={28} color={colors.accent} />
        <p
          style={{ fontFamily: fonts.heading, color: colors.text, fontSize: "clamp(18px, 2.4vw, 24px)", fontWeight: 600, lineHeight: 1.5 }}
          className="mt-5 max-w-2xl"
        >
          {quote}
        </p>
        <div className="flex items-center gap-3 mt-6">
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 38, height: 38, background: "#fff", color: colors.accent, fontWeight: 700 }}
          >
            <span style={{ fontFamily: fonts.heading }}>{authorInitials}</span>
          </div>
          <div className="text-left">
            <p style={{ fontFamily: fonts.body, color: colors.text, fontSize: 14, fontWeight: 600 }}>{authorName}</p>
            <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 13 }}>{authorContext}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
