import { Calendar, MapPin } from "lucide-react";
import { colors, fonts } from "../../theme/tokens";
import type { HackathonEvent } from "../../types/hackathon";

interface HackathonCardProps {
  event: HackathonEvent;
  onAction?: (event: HackathonEvent) => void;
}

export default function HackathonCard({ event, onAction }: HackathonCardProps) {
  const { title, theme, date, mode, status } = event;
  const open = status === "Inscriptions ouvertes";

  return (
    <div className="rounded-xl p-6 flex flex-col hover:shadow-md transition-shadow" style={{ border: `1px solid ${colors.border}` }}>
      <span
        style={{
          fontFamily: fonts.body,
          fontSize: 12,
          fontWeight: 500,
          color: open ? colors.mint : colors.muted,
          background: open ? colors.mintSoft : colors.subtle,
        }}
        className="self-start px-2.5 py-1 rounded-full"
      >
        {status}
      </span>
      <h3 style={{ fontFamily: fonts.heading, color: colors.text, fontSize: 19, fontWeight: 700 }} className="mt-4">
        {title}
      </h3>
      <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14 }} className="mt-1.5">
        {theme}
      </p>

      <div className="flex flex-col gap-2 mt-5" style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 13 }}>
        <div className="flex items-center gap-2">
          <Calendar size={14} /> {date}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} /> {mode}
        </div>
      </div>

      <button
        onClick={() => onAction?.(event)}
        style={{
          fontFamily: fonts.body,
          color: open ? "#fff" : colors.text,
          background: open ? colors.accent : colors.subtle,
          fontWeight: 500,
          fontSize: 14,
        }}
        className="mt-6 py-2.5 rounded-md hover:opacity-90"
      >
        {open ? "S'inscrire" : "En savoir plus"}
      </button>
    </div>
  );
}
