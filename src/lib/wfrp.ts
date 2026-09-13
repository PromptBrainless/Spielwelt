/** WFRP 4e — deutsche Knowledge-Liste. 10 Werte, 45 Fähigkeiten. */

import raw from "@/data/wfrp-skills.json";

export const CHARS = [
  { key: "kg", short: "KG", name: "Kampfgeschick" },
  { key: "bf", short: "BF", name: "Ballistische Fertigkeit" },
  { key: "st", short: "ST", name: "Stärke" },
  { key: "wi", short: "WI", name: "Widerstand" },
  { key: "i", short: "I", name: "Initiative" },
  { key: "gw", short: "GW", name: "Gewandtheit" },
  { key: "gs", short: "GS", name: "Geschicklichkeit" },
  { key: "in", short: "IN", name: "Intelligenz" },
  { key: "wk", short: "WK", name: "Willenskraft" },
  { key: "ch", short: "CH", name: "Charisma" },
] as const;

export type CharKey = (typeof CHARS)[number]["key"];
export type SkillArt = "grund" | "ausbau";

export type SkillDef = {
  key: string;
  name: string;
  char: CharKey;
  art: SkillArt;
  specs: string[];
};

export const SKILLS: SkillDef[] = (raw.skills as { id: string; name: string; attr: CharKey; art: SkillArt; specs: string[] }[]).map(
  (s) => ({
    key: s.id,
    name: s.name,
    char: s.attr,
    art: s.art,
    specs: s.specs ?? [],
  }),
);

export type SkillKey = (typeof raw.skills)[number]["id"];

export const GRUND = SKILLS.filter((s) => s.art === "grund");
export const AUSBAU = SKILLS.filter((s) => s.art === "ausbau");

export type Character = {
  id: string;
  name: string;
  career: string;
  chars: Record<CharKey, number>;
  advances: Partial<Record<string, number>>;
  specs: Partial<Record<string, string>>;
};

export function emptyCharacter(name = ""): Character {
  const chars = {} as Record<CharKey, number>;
  for (const c of CHARS) chars[c.key] = 30;
  return {
    id: `pc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
    name,
    career: "",
    chars,
    advances: {},
    specs: {},
  };
}

const CHAR_ALIAS: Record<string, CharKey> = {
  kt: "kg",
  kg: "kg",
  fk: "bf",
  bf: "bf",
  s: "st",
  st: "st",
  z: "wi",
  wi: "wi",
  i: "i",
  ge: "gw",
  gw: "gw",
  gs: "gs",
  int: "in",
  in: "in",
  k: "in",
  wk: "wk",
  ch: "ch",
};

const SKILL_ALIAS: Record<string, string> = {
  gassenwissen: "klatsch",
  ueberreden: "charme",
  kaltblut: "besonnenheit",
  fuehren: "anfuehren",
  orientierung: "navigation",
};

export function migrateCharacter(rawPc: unknown): Character {
  const p = (rawPc || {}) as Partial<Character> & {
    chars?: Record<string, number>;
    advances?: Record<string, number>;
    specs?: Record<string, string>;
  };
  const base = emptyCharacter(p.name || "");
  if (typeof p.id === "string") base.id = p.id;
  base.career = p.career || "";
  for (const [k, v] of Object.entries(p.chars || {})) {
    const nk = CHAR_ALIAS[k];
    if (nk && typeof v === "number") base.chars[nk] = v;
  }
  for (const [k, v] of Object.entries(p.advances || {})) {
    const nk = SKILL_ALIAS[k] || k;
    if (typeof v === "number") base.advances[nk] = v;
  }
  for (const [k, v] of Object.entries(p.specs || {})) {
    if (typeof v === "string") base.specs[k] = v;
  }
  return base;
}

export function skillDef(key: string): SkillDef | undefined {
  return SKILLS.find((s) => s.key === key);
}

export function trained(pc: Character, skill: string): boolean {
  const def = skillDef(skill);
  if (!def) return false;
  if (def.art === "grund") return true;
  return (pc.advances[skill] ?? 0) > 0;
}

export function skillTarget(pc: Character, skill: string, mod = 0): number {
  const def = skillDef(skill);
  if (!def) return 0;
  const base = pc.chars[def.char] ?? 30;
  const adv = pc.advances[skill] ?? 0;
  return Math.max(1, Math.min(99, base + adv + mod));
}

export type TestResult = {
  skill: string;
  skillName: string;
  target: number;
  roll: number;
  sl: number;
  success: boolean;
  crit: boolean;
  fumble: boolean;
  illegal?: boolean;
};

export function rollTest(pc: Character, skill: string, mod = 0): TestResult {
  const def = skillDef(skill)!;
  if (!trained(pc, skill)) {
    return {
      skill,
      skillName: def.name,
      target: 0,
      roll: 0,
      sl: 0,
      success: false,
      crit: false,
      fumble: false,
      illegal: true,
    };
  }
  const target = skillTarget(pc, skill, mod);
  const roll = 1 + Math.floor(Math.random() * 100);
  const sl = Math.floor(target / 10) - Math.floor(roll / 10);
  const success = roll <= target;
  const double = roll % 11 === 0;
  return {
    skill,
    skillName: def.name,
    target,
    roll,
    sl,
    success,
    crit: success && double,
    fumble: !success && (double || roll >= 96),
  };
}

export function formatTest(r: TestResult): string {
  if (r.illegal) return `${r.skillName} · nicht ausgebildet`;
  const mark = r.crit ? "kritisch" : r.fumble ? "patzer" : r.success ? "gelungen" : "misslungen";
  const sl = r.sl >= 0 ? `+${r.sl}` : String(r.sl);
  return `${r.skillName} ${r.roll} gegen ${r.target} · SL ${sl} · ${mark}`;
}

export type WfrpRoll = {
  tens: number;
  units: number;
  roll: number;
  target: number;
  sl: number;
  success: boolean;
};

export function rollD100(): { roll: number; tens: number; units: number } {
  const roll = 1 + Math.floor(Math.random() * 100);
  if (roll === 100) return { roll, tens: 0, units: 0 };
  return { roll, tens: Math.floor(roll / 10), units: roll % 10 };
}

export function testSkill(
  skill: number,
  die: { roll: number; tens: number; units: number },
): WfrpRoll {
  const sl = Math.floor(skill / 10) - Math.floor(die.roll / 10);
  return { ...die, target: skill, sl, success: die.roll <= skill };
}

export function formatRoll(r: WfrpRoll): string {
  const sl = r.sl >= 0 ? `+${r.sl}` : String(r.sl);
  return `${r.roll} gegen ${r.target} · SL ${sl} · ${r.success ? "gelungen" : "misslungen"}`;
}
