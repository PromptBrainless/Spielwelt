import { catalog } from "@/lib/catalog";
import { allPeople, personById } from "@/data/npcs";
import type { Person } from "@/lib/types";

/** Stände, wie das Heft sie schreibt. Keine Extra-Leiter. */
export const STAND_ORDER = [
  "Amt",
  "Gilde",
  "Silber",
  "Schenke",
  "Messing",
  "öffentlich",
  "Erweiterung",
  "leer",
  "ohne Eintrag",
  "nicht in der Stadt",
] as const;

export type StandLabel = (typeof STAND_ORDER)[number];

export type Stance = "gutmütig" | "schlecht" | "müde" | "neutral" | "offen";

const AWAY = new Set<string>(["ilse-vollrath", "pieter-halbritter", "abel-stolzenau", "mira-stolzenau"]);

function placeStand(id?: string): string {
  if (!id) return "";
  const place = catalog.places.find((p) => String(p.id) === String(id));
  return (place?.stand || "").trim();
}

export function standOf(person: Person): StandLabel {
  if (AWAY.has(person.id)) return "nicht in der Stadt";
  const raw = placeStand(person.home) || placeStand(person.work);
  if (!raw) return "ohne Eintrag";
  if (raw === "Amt") return "Amt";
  if (raw === "Gilde") return "Gilde";
  if (raw === "Silber") return "Silber";
  if (raw === "Schenke") return "Schenke";
  if (raw === "Messing") return "Messing";
  if (raw === "öffentlich") return "öffentlich";
  if (raw === "Erweiterung") return "Erweiterung";
  if (raw === "leer" || raw.startsWith("kein")) return "leer";
  if (raw.startsWith("Arbeit")) return standOfHomeOnly(person);
  return "ohne Eintrag";
}

function standOfHomeOnly(person: Person): StandLabel {
  const raw = placeStand(person.home);
  if (raw === "Silber") return "Silber";
  if (raw === "Messing") return "Messing";
  return "ohne Eintrag";
}

export function statusOf(person: Person): string {
  if (AWAY.has(person.id)) return "—";
  return placeStand(person.home) || placeStand(person.work) || "—";
}

/** Haltung setzen wir nicht aus Armut oder Amt. Offen, bis der Tisch sie zeigt. */
export function stanceOf(_person: Person): Stance {
  return "offen";
}

const KIN_NOTE =
  /^(Mann|Frau|Sohn|Tochter|Vater|Mutter|Onkel|Neffe|Witwe|Kind|Meisterin|Meister|haust)\b|verschwunden|tot/;

export function kinship(person: Person, extra: Person[] = []): string {
  const bits: string[] = [];
  for (const tie of person.ties) {
    if (!tie.npc || !KIN_NOTE.test(tie.note)) continue;
    const other = personById(tie.npc, extra)?.name || tie.npc;
    const term = tie.note.split(/[·,]/)[0].trim();
    bits.push(`${term} von ${other}`);
  }
  return bits.join("; ") || "—";
}

export function relations(person: Person, extra: Person[] = []): string {
  const bits: string[] = [];
  if (person.work && person.work !== person.home) bits.push(`Arbeit ${person.work}`);
  for (const tie of person.ties) {
    if (tie.npc && KIN_NOTE.test(tie.note)) continue;
    if (tie.npc) {
      const other = personById(tie.npc, extra)?.name || tie.npc;
      bits.push(`${other}: ${tie.note}`);
    } else if (tie.place) {
      bits.push(tie.note);
    }
  }
  return bits.join("; ") || "—";
}

/** Nur Sätze, die das Heft so hergibt. */
export function hostility(_person: Person): string {
  return "—";
}

export function rankedPeople(extra: Person[] = []): Person[] {
  return [...allPeople(extra)].sort((a, b) => {
    const d = STAND_ORDER.indexOf(standOf(a)) - STAND_ORDER.indexOf(standOf(b));
    if (d) return d;
    const h = (a.house || "").localeCompare(b.house || "", "de");
    if (h) return h;
    return a.name.localeCompare(b.name, "de");
  });
}

export function groupedPeople(extra: Person[] = []): { stand: StandLabel; rows: Person[] }[] {
  const map = new Map<StandLabel, Person[]>();
  for (const stand of STAND_ORDER) map.set(stand, []);
  for (const p of rankedPeople(extra)) {
    map.get(standOf(p))?.push(p);
  }
  return STAND_ORDER.map((stand) => ({ stand, rows: map.get(stand) || [] })).filter(
    (g) => g.rows.length > 0,
  );
}
