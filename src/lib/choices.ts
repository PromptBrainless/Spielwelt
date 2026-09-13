import { displayName } from "@/lib/catalog";
import type { PlaceFieldKey } from "@/lib/sicht";
import type { Place } from "@/lib/types";

export type Choice = { value: string; label: string };

const SHORT: PlaceFieldKey[] = ["name", "haus", "familie", "typ", "stand"];

export const STAND_CHOICES = [
  "Messing",
  "Silber",
  "Gold",
  "Erweiterung",
  "leer",
  "öffentlich",
  "Gilde",
  "Amt",
  "Schenke",
  "Kult",
  "Zoll",
  "kein Wohnen",
  "keine Wohnfamilie",
];

export const TYP_CHOICES = [
  "Arme Wohnstatt",
  "Wohnhaus",
  "Bürgerhaus",
  "Leerstand",
  "Notdach",
  "Kleinbauernstelle",
  "Gasthaus / Ankunft",
  "Schenke / zwielichtiger Laden",
  "Kramladen",
  "Handwerk",
  "Wache / Herberge",
  "Zoll / Torwache",
  "Stadttor / Kontrolle",
  "Öffentlicher Brunnen",
  "Hauptkultstätte",
  "Almosen / kleine Gnade",
  "Gilde / Versammlung",
  "Rat / Gericht",
  "Trauer / Ritus",
  "Abstellplatz / Versteck",
];

export const PHRASES: Partial<Record<PlaceFieldKey, string[]>> = {
  am_tisch: [
    "Karte ziehen, wenn die Gruppe ankommt.",
    "Nicht erklären. Die Spieler selbst lesen lassen.",
    "Nachts ziehen, wenn die Gruppe friert.",
    "Frage: wessen Sache liegt hier offen?",
    "Unterschlupf, der einen Preis hat.",
    "Guter Ort für Proviant gegen Arbeit.",
  ],
  eskalation: [
    "Alltag: \nDruck: \nSpur: ",
    "Alltag: fragen, zahlen, weitergehen.\nDruck: jemand zählt mit.\nSpur: weiter zum nächsten Kernort.",
    "Alltag: stehen bleiben, nichts anfassen.\nDruck: wer anfasst, wird gesehen.\nSpur: das Gerücht wird wahr, oder es bleibt still.",
  ],
  sl: [
    "Kern. Am Tisch nutzbar.",
    "Erweiterung Fotoheft. Kein Stammbaum.",
    "Keim still. Nicht ausspielen, bis es so weit ist.",
    "Arbeitshaus, keine Wohnung.",
  ],
  riecht: [
    "Nasser Lehm, alter Holzrauch.",
    "Kohl, nasse Wäsche, Herdrauch.",
    "Nasses Holz, altes Leder, Achsfett.",
    "Schmierseife, nasses Tuch, stehendes Wasser.",
    "Kalk, Stroh, nasse Wolle.",
    "Eisen, nasser Stein, Angstschweiß.",
    "Bier, nasses Holz, Pferde.",
    "Harz, Rauch, nasses Splint.",
    "Moos, Schimmel, nasses Holz.",
    "Laub, nasse Erde, ferne Rose.",
  ],
  sieht: [
    "Strohhütte, eine Tür, kahle Bäume.",
    "Lehmhaus, Flechtzaun, Rauch aus dem First.",
    "Offene Holzscheune, Matsch, Geschirr an der Wand.",
    "Verwitterter Stock, eingeschnittenes Zeichen, nasser Pfad.",
    "Stein, Gitter, nasser Hof.",
    "Erker, Holz, ein Fenster zur Gasse.",
  ],
};

function clip(value: string, max = 72): string {
  const line = value.replace(/\s+/g, " ").trim();
  if (line.length <= max) return line;
  return `${line.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

function unique(values: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of values) {
    const v = raw.trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

export function isShortField(key: PlaceFieldKey): boolean {
  return SHORT.includes(key);
}

export function fieldChoices(
  key: PlaceFieldKey,
  places: Place[],
  library: string[],
  currentId: string,
): { vorschlaege: Choice[]; gemerkt: Choice[]; katalog: Choice[] } {
  const extras =
    key === "stand" ? STAND_CHOICES : key === "typ" ? TYP_CHOICES : PHRASES[key] || [];

  const vorschlaege = unique(extras).map((value) => ({ value, label: clip(value) }));
  const gemerkt = unique(library).map((value) => ({ value, label: clip(value) }));

  const found = new Map<string, string>();
  for (const place of places) {
    if (String(place.id) === String(currentId)) continue;
    const value = String(place[key] ?? "").trim();
    if (!value || found.has(value)) continue;
    const short = isShortField(key);
    found.set(value, short ? value : `${displayName(place)} · ${clip(value, 48)}`);
  }
  const katalog = [...found.entries()]
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.label.localeCompare(b.label, "de"));

  return { vorschlaege, gemerkt, katalog };
}
