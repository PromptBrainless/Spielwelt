import type { Place } from "@/lib/types";

export type Sicht = "spieler" | "sl";

export type PlaceFieldKey =
  | "name"
  | "haus"
  | "familie"
  | "typ"
  | "stand"
  | "kanon"
  | "sieht"
  | "riecht"
  | "wer"
  | "am_tisch"
  | "spieltext"
  | "spielkern"
  | "szene"
  | "geruecht"
  | "sl"
  | "eskalation";

export type PlaceField = {
  key: PlaceFieldKey;
  label: string;
  sicht: Sicht;
};

/** What the group may hear or see. */
export const TISCH_FIELDS: PlaceField[] = [
  { key: "kanon", label: "Kanon", sicht: "spieler" },
  { key: "sieht", label: "Man sieht", sicht: "spieler" },
  { key: "riecht", label: "Man riecht", sicht: "spieler" },
  { key: "wer", label: "Wer hier ist", sicht: "spieler" },
  { key: "am_tisch", label: "Am Tisch", sicht: "spieler" },
  { key: "spieltext", label: "Spielertext", sicht: "spieler" },
  { key: "spielkern", label: "Kanonischer Kern", sicht: "spieler" },
  { key: "szene", label: "Szene", sicht: "spieler" },
];

/** Only the GM. Never mixed into table copy. */
export const SL_FIELDS: PlaceField[] = [
  { key: "geruecht", label: "Gerücht", sicht: "sl" },
  { key: "sl", label: "Für die Spielleitung", sicht: "sl" },
  { key: "eskalation", label: "Gespräch", sicht: "sl" },
];

export const META_FIELDS: PlaceField[] = [
  { key: "name", label: "Name", sicht: "spieler" },
  { key: "haus", label: "Haus", sicht: "spieler" },
  { key: "familie", label: "Familie", sicht: "spieler" },
  { key: "typ", label: "Typ", sicht: "spieler" },
  { key: "stand", label: "Stand", sicht: "spieler" },
];

export function hasTischPlay(place: Place): boolean {
  return Boolean(place.spieltext || place.spielkern || place.szene);
}
