import { Trophy } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";
import type { ProjectSummary } from "../../types/hackathon";

const DEFAULT_PROJECTS: ProjectSummary[] = [
  { title: "MediLink", team: "MediLink", tag: "SANTÉ" },
  { title: "EcoRoute", team: "GreenLoop", tag: "ENVIRONNEMENT" },
  { title: "SafeRoute", team: "Nightwalkers", tag: "SÉCURITÉ" },
];

export default function ProjectTeaser({ projects = DEFAULT_PROJECTS }: { projects?: ProjectSummary[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p style={{ fontFamily: fonts.body, color: colors.accent, fontSize: 13, fontWeight: 600 }} className="uppercase tracking-wide">
            Réalisations
          </p>
          <h2 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 26, fontWeight: 700 }} className="mt-1">
            Ce que les équipes construisent
          </h2>
          <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 15 }} className="mt-2">
            Un aperçu des projets nés lors de nos dernières éditions.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        {projects.map((p) => (
          <div key={p.title} className="rounded-xl p-6 hover:shadow-md transition-shadow" style={{ border: `1px solid ${colors.border}` }}>
            <span
              style={{ fontFamily: fonts.body, fontSize: 11, fontWeight: 500, color: colors.accent, background: colors.accentSoft }}
              className="px-2 py-1 rounded"
            >
              {p.tag}
            </span>
            <div className="flex items-center gap-2 mt-4">
              <Trophy size={15} color={colors.mint} />
              <h3 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 16, fontWeight: 700 }}>{p.title}</h3>
            </div>
            <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 13 }} className="mt-1">
              équipe {p.team}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
