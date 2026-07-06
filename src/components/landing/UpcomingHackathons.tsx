import { colors, fonts } from "../../theme/tokens";
import HackathonCard from "./HackathonCard";
import type { HackathonEvent } from "../../types/hackathon";

const DEFAULT_EVENTS: HackathonEvent[] = [
  { title: "Tech for Good 2026", theme: "L'innovation au service de l'impact social", date: "21 – 27 Juillet 2026", mode: "En ligne", status: "Inscriptions ouvertes" },
  { title: "FinTech Sprint", theme: "Réinventer l'accès aux services financiers", date: "12 – 14 Septembre 2026", mode: "Casablanca — Présentiel", status: "Bientôt" },
  { title: "EdTech Challenge", theme: "L'apprentissage augmenté par l'IA", date: "3 – 5 Octobre 2026", mode: "Hybride", status: "Bientôt" },
];

interface UpcomingHackathonsProps {
  events?: HackathonEvent[];
  onAction?: (event: HackathonEvent) => void;
}

export default function UpcomingHackathons({ events = DEFAULT_EVENTS, onAction }: UpcomingHackathonsProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p style={{ fontFamily: fonts.body, color: colors.accent, fontSize: 13, fontWeight: 600 }} className="uppercase tracking-wide">
            À venir
          </p>
          <h2 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 26, fontWeight: 700 }} className="mt-1">
            Hackathons à venir
          </h2>
          <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 15 }} className="mt-2">
            Choisissez un événement et rejoignez-le dès maintenant.
          </p>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((e) => (
          <HackathonCard key={e.title} event={e} onAction={onAction} />
        ))}
      </div>
    </section>
  );
}
