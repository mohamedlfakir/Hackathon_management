// src/theme/adminTokens.ts
//
// Palette for the authenticated console (admin / manager / judge / participant).
// It's additive on top of ../theme/tokens: the brand accent and both font
// families are pulled straight from there so the app reads as one product,
// while this file adds the light neutral scale + semantic colors a dashboard
// needs (status pills, banners, hover states) that the public tokens don't.
//
// NOTE: `colors.accent` from ./tokens is reused as-is, whatever hex it is.
// The soft/strong variants are derived with color-mix() instead of hardcoded
// hex so they stay correct even without knowing the exact brand color.

import { colors as brand, fonts } from "./tokens";

export const adminColors = {
  // surfaces
  bg: "#FAFAFC",
  surface: "#FFFFFF",
  surfaceHover: "#F1F1F7",
  border: "#E7E7F0",
  borderStrong: "#DADAE3",

  // text
  text: "#15151F",
  muted: "#6B6B7C",
  faint: "#9A9AA9",

  // brand (carried over from the public site for consistency)
  accent: brand.accent,
  accentSoft: `color-mix(in srgb, ${brand.accent} 12%, white)`,
  accentText: `color-mix(in srgb, ${brand.accent} 82%, black)`,

  // semantic — used for status pills / badges across hackathons, teams,
  // submissions and evaluations (e.g. "En attente", "Accepté", "Refusé")
  success: "#178A46",
  successSoft: "#E7F6EC",
  warning: "#B7791F",
  warningSoft: "#FDF3DE",
  danger: "#C0362C",
  dangerSoft: "#FBE9E7",
  info: "#0B76C2",
  infoSoft: "#E6F3FC",
} as const;

export const adminFonts = fonts;

// Human-readable labels for each role, used in the sidebar badge, the
// profile menu and anywhere else a role needs to be displayed.
export const roleLabels: Record<string, string> = {
  ADMIN: "Admin",
  ORGANIZER: "Organisateur",
  JUDGE: "Juré",
  PARTICIPANT: "Participant",
};