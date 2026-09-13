import type { Person } from "@/lib/types";

export const TALK_KEYS = ["alltag", "druck", "spur", "silber", "faust", "blick"] as const;
export type TalkKey = (typeof TALK_KEYS)[number];

export type TalkLine = {
  key: TalkKey;
  label: string;
  skill: string | null;
  mod: number;
  win: string;
  fail: string;
};

const LABELS: Record<TalkKey, string> = {
  alltag: "Alltag",
  druck: "Druck",
  spur: "Spur",
  silber: "Silber",
  faust: "Faust",
  blick: "Blick",
};

function line(
  key: TalkKey,
  skill: string | null,
  mod: number,
  win: string,
  fail: string,
): TalkLine {
  return { key, label: LABELS[key], skill, mod, win, fail };
}

function standMod(person: Person): { silber: number; faust: number; gasse: number } {
  const blob = `${person.role} ${person.does} ${person.house ?? ""}`.toLowerCase();
  const high =
    /gild|kaufmann|notar|ratshaus|priester|zoll|waage|silber/.test(blob);
  const low =
    /bettler|tagelöhn|ordnung|hütte|gasse|kranken/.test(blob);
  if (high) return { silber: -20, faust: -20, gasse: -10 };
  if (low) return { silber: 10, faust: 10, gasse: 20 };
  return { silber: 0, faust: 0, gasse: 0 };
}

/** Tests for this mouth. Alltag never rolls. Arrival never rolls. */
export function talkFor(person: Person): TalkLine[] {
  const m = standMod(person);
  const name = person.name.split(" ")[0] || person.name;
  return [
    line("alltag", null, 0, "Kauf oder Klopfen. Kein Wurf.", "Kauf oder Klopfen. Kein Wurf."),
    line(
      "druck",
      "klatsch",
      m.gasse,
      `${name} lässt ein Gerücht, das schon in der Gasse liegt. Nicht die Wahrheit hinterm Schirm.`,
      `${name} sagt den Satz, den jeder sagt. Die Lüge der Stadt.`,
    ),
    line(
      "spur",
      "intuition",
      0,
      `${name} zeigt den nächsten Hof — einen, der schon im Heft steht.`,
      `${name} schickt sie woanders hin oder schweigt.`,
    ),
    line(
      "silber",
      "bestechen",
      m.silber,
      `${name} nimmt. Ein Blatt, ein Name, eine Stunde. Der Preis bleibt.`,
      `${name} nimmt das Silber und gibt Alltag. Oder ruft, wenn Stand hoch ist.`,
    ),
    line(
      "faust",
      "einschuechtern",
      m.faust,
      `${name} knickt. Kurz. Hasst danach.`,
      `${name} ruft oder beißt. Alltag zerbricht. Kein Kampfzwang — SL setzt.`,
    ),
    line(
      "blick",
      "wahrnehmung",
      0,
      "Etwas am Ort, das schon im Heft steht: Staublinie, Münze, X, durchgestrichener Name.",
      "Nur was Ankunft schon gab. Nichts extra.",
    ),
  ];
}

export function difficultyLabel(mod: number): string {
  if (mod >= 20) return "leicht";
  if (mod >= 10) return "einfach";
  if (mod <= -30) return "sehr schwer";
  if (mod <= -20) return "schwer";
  if (mod < 0) return "knifflig";
  return "mittel";
}