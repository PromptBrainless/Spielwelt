import type { Person } from "@/lib/types";

export const QUEST_TYPES = [
  "Gespräch",
  "Fund",
  "Intrige",
  "Auftrag",
  "Mordfall",
  "Erkunden",
  "Verhandeln",
  "Geleit",
  "Diebstahl",
  "Politisch",
] as const;

export const DIFFICULTIES = ["leicht", "mittel", "hart"] as const;
export const PRIORITIES = ["niedrig", "normal", "hoch"] as const;

export const TRIGGER_KINDS = [
  "Brief",
  "Gespräch",
  "Gerücht",
  "Fundstück",
  "Gebiet betreten",
  "Kampf",
  "Leiche",
  "Schatzkarte",
  "Ereignis",
  "Brett",
  "Händler",
  "Fraktion",
  "Zufall",
] as const;

export const GOAL_KINDS = [
  "Töten",
  "Sammeln",
  "Erkunden",
  "Beschützen",
  "Begleiten",
  "Verhandeln",
  "Herstellen",
  "Rätsel",
  "Überleben",
  "Stehlen",
  "Infiltrieren",
  "Entscheiden",
] as const;

export const QUEST_STATUSES = ["still", "gelegt", "aktiv", "fertig"] as const;

export const NODE_KEYS = [
  "trigger",
  "geber",
  "aufgabe",
  "hinweise",
  "konflikt",
  "entscheidung",
  "konsequenz",
  "belohnung",
  "welt",
  "folge",
] as const;

export const NODE_LABELS: Record<QuestNodeKey, string> = {
  trigger: "Trigger",
  geber: "Geber",
  aufgabe: "Aufgabe",
  hinweise: "Hinweise",
  konflikt: "Konflikt",
  entscheidung: "Entscheidung",
  konsequenz: "Konsequenz",
  belohnung: "Belohnung",
  welt: "Welt",
  folge: "Folge",
};

export const VARIANT_KEYS = [
  "wahrscheinlich",
  "alternativ",
  "kreativ",
  "chaotisch",
  "böse",
] as const;

export type QuestNodeKey = (typeof NODE_KEYS)[number];
export type QuestStatus = (typeof QUEST_STATUSES)[number];
export type VariantKey = (typeof VARIANT_KEYS)[number];

export type QuestTrigger = {
  id: string;
  kind: string;
  place: string;
  npc: string;
  condition: string;
  chance: string;
  once: boolean;
};

export type QuestGiver = {
  npcId: string;
  name: string;
  race: string;
  age: string;
  role: string;
  faction: string;
  alignment: string;
  status: string;
  ties: string;
  enemies: string;
  secrets: string;
  motive: string;
  fear: string;
  goals: string;
};

export type QuestStory = {
  believes: string;
  happened: string;
  twist: string;
  truth: string;
};

export type QuestGoal = {
  id: string;
  text: string;
  kind: string;
  required: boolean;
  progress: number;
  fail: string;
  success: string;
  reward: string;
};

export type WorldChange = {
  npcs: string;
  dialogs: string;
  places: string;
  traders: string;
  enemies: string;
  factions: string;
};

export type DecisionBranch = {
  id: string;
  label: string;
  outcome: string;
  children: DecisionBranch[];
};

export type QuestRewards = {
  groschen: string;
  xp: string;
  items: string;
  ruf: string;
  ties: string;
  world: string;
  unlocks: string;
  faction: string;
};

export type QuestLore = {
  places: string;
  factions: string;
  people: string;
  events: string;
  when: string;
};

export type QuestVariant = {
  key: VariantKey;
  player: string;
  npcs: string;
  ruf: string;
  next: string;
  fight: boolean;
  consequence: string;
};

export type Quest = {
  id: string;
  name: string;
  type: string;
  difficulty: string;
  career: string;
  faction: string;
  region: string;
  repeatable: boolean;
  priority: string;
  requires: string;
  follow: string;
  series: string;
  status: QuestStatus;
  triggers: QuestTrigger[];
  giver: QuestGiver;
  story: QuestStory;
  goals: QuestGoal[];
  world: WorldChange;
  tree: DecisionBranch[];
  rewards: QuestRewards;
  lore: QuestLore;
  variants: QuestVariant[];
  actions: string;
  nodes: Record<QuestNodeKey, string>;
};

export function nid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function emptyVariant(key: VariantKey): QuestVariant {
  return { key, player: "", npcs: "", ruf: "", next: "", fight: false, consequence: "" };
}

export const FIRST_QUEST_ID = "q-1-1";

export function emptyQuest(id?: string, name = ""): Quest {
  return {
    id: id || nid("q"),
    name,
    type: "Gespräch",
    difficulty: "mittel",
    career: "",
    faction: "",
    region: "",
    repeatable: false,
    priority: "normal",
    requires: "",
    follow: "",
    series: "",
    status: "still",
    triggers: [
      {
        id: nid("t"),
        kind: "Gespräch",
        place: "",
        npc: "",
        condition: "",
        chance: "immer",
        once: true,
      },
    ],
    giver: {
      npcId: "",
      name: "",
      race: "Mensch",
      age: "",
      role: "",
      faction: "",
      alignment: "",
      status: "",
      ties: "",
      enemies: "",
      secrets: "",
      motive: "",
      fear: "",
      goals: "",
    },
    story: { believes: "", happened: "", twist: "", truth: "" },
    goals: [
      {
        id: nid("g"),
        text: "",
        kind: "Verhandeln",
        required: true,
        progress: 0,
        fail: "",
        success: "",
        reward: "",
      },
    ],
    world: { npcs: "", dialogs: "", places: "", traders: "", enemies: "", factions: "" },
    tree: [{ id: nid("d"), label: "", outcome: "", children: [] }],
    rewards: {
      groschen: "",
      xp: "",
      items: "",
      ruf: "",
      ties: "",
      world: "",
      unlocks: "",
      faction: "",
    },
    lore: { places: "", factions: "", people: "", events: "", when: "2512 IZ" },
    variants: VARIANT_KEYS.map(emptyVariant),
    actions: "",
    nodes: {
      trigger: "",
      geber: "",
      aufgabe: "",
      hinweise: "",
      konflikt: "",
      entscheidung: "",
      konsequenz: "",
      belohnung: "",
      welt: "",
      folge: "",
    },
  };
}

export function firstQuest(): Quest {
  return emptyQuest(FIRST_QUEST_ID, "Der leere Laden");
}

export function giverFromPerson(p: Person): Partial<QuestGiver> {
  return {
    npcId: p.id,
    name: p.name,
    age: p.age ?? "",
    role: p.role,
    ties: p.ties.map((t) => t.note).filter(Boolean).join("; "),
    goals: p.does,
  };
}

export function questsAtPlace(quests: Quest[], placeId: string): { quest: Quest; trigger: QuestTrigger }[] {
  const id = String(placeId);
  const out: { quest: Quest; trigger: QuestTrigger }[] = [];
  for (const quest of quests) {
    for (const trigger of quest.triggers) {
      if (String(trigger.place) === id) out.push({ quest, trigger });
    }
  }
  return out;
}

export function statusLabel(s: QuestStatus): string {
  if (s === "still") return "still";
  if (s === "gelegt") return "aufgelegt";
  if (s === "aktiv") return "aktiv";
  return "fertig";
}

export function nodeFilled(quest: Quest, key: QuestNodeKey): boolean {
  const n = quest.nodes[key]?.trim();
  if (n) return true;
  if (key === "trigger") return quest.triggers.some((t) => t.place || t.condition);
  if (key === "geber") return Boolean(quest.giver.name || quest.giver.npcId);
  if (key === "aufgabe") return quest.goals.some((g) => g.text.trim());
  if (key === "hinweise") return Boolean(quest.story.believes.trim());
  if (key === "konflikt") return Boolean(quest.story.happened.trim() || quest.story.twist.trim());
  if (key === "entscheidung") return quest.tree.some((b) => b.label.trim());
  if (key === "konsequenz") return Boolean(quest.story.truth.trim());
  if (key === "belohnung") return Boolean(quest.rewards.groschen || quest.rewards.items || quest.rewards.ruf);
  if (key === "welt") return Object.values(quest.world).some((v) => v.trim());
  if (key === "folge") return Boolean(quest.follow.trim() || quest.series.trim());
  return false;
}
