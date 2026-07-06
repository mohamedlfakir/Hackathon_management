import { ArrowRight } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";

interface ClosingCTAProps {
  onParticipate?: () => void;
}

export default function ClosingCTA({ onParticipate }: ClosingCTAProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="rounded-2xl px-8 py-14 text-center flex flex-col items-center" style={{ background: colors.text }}>
        <h2 style={{ fontFamily: fonts.heading, color: "#fff", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 700 }} className="max-w-lg">
          Votre prochaine idée commence par une équipe
        </h2>
        <p style={{ fontFamily: fonts.body, color: "rgba(255,255,255,0.7)", fontSize: 15 }} className="mt-3 max-w-md">
          Créez votre compte et rejoignez le prochain hackathon disponible.
        </p>
        <button
          onClick={onParticipate}
          style={{ fontFamily: fonts.body, color: colors.text, background: "#fff", fontWeight: 600, fontSize: 15 }}
          className="mt-7 px-7 py-3 rounded-md flex items-center gap-2 hover:opacity-90"
        >
          Participer maintenant <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
