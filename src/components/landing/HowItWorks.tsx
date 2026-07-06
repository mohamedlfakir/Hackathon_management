import { Rocket, Search, UsersRound, type LucideIcon } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";

interface Step {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  { icon: Search, title: "Trouvez un hackathon", desc: "Parcourez les événements ouverts et choisissez celui qui correspond à vos intérêts." },
  { icon: UsersRound, title: "Formez une équipe", desc: "Créez votre équipe ou rejoignez-en une déjà formée pour affronter le défi ensemble." },
  { icon: Rocket, title: "Construisez et présentez", desc: "Développez votre projet, soumettez-le, et présentez-le devant le jury." },
];

export default function HowItWorks() {
  return (
    <section style={{ background: colors.subtle }} className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <p style={{ fontFamily: fonts.body, color: colors.accent, fontSize: 13, fontWeight: 600 }} className="uppercase tracking-wide">
          Le parcours
        </p>
        <h2 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 26, fontWeight: 700 }} className="mt-1 mb-10">
          Comment participer
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg flex items-center justify-center" style={{ width: 42, height: 42, background: colors.accentSoft }}>
                  <s.icon size={20} color={colors.accent} />
                </div>
                <span style={{ fontFamily: fonts.heading, color: colors.border, fontSize: 26, fontWeight: 700 }}>0{i + 1}</span>
              </div>
              <h3 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 16, fontWeight: 700 }}>{s.title}</h3>
              <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14 }} className="mt-2">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
