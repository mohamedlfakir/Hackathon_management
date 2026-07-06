import { colors, fonts } from "../../theme/tokens";

interface Stat {
  value: string;
  label: string;
}

const DEFAULT_STATS: Stat[] = [
  { value: "120+", label: "hackathons organisés" },
  { value: "5 000+", label: "participants" },
  { value: "800+", label: "projets soumis" },
  { value: "60+", label: "villes et universités" },
];

export default function Stats({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <section style={{ borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <p style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 26, fontWeight: 700 }}>{s.value}</p>
            <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 13 }} className="mt-1">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
