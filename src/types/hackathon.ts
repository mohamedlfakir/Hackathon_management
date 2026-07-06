export type HackathonStatus = "Inscriptions ouvertes" | "Bientôt" | "Terminé";

export interface HackathonEvent {
  title: string;
  theme: string;
  date: string;
  mode: string;
  status: HackathonStatus;
}

export interface ProjectSummary {
  title: string;
  team: string;
  tag: string;
}

export interface CarouselSlide {
  seed: string;
  caption: string;
  tag: string;
}
