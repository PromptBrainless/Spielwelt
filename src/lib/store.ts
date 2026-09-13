import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DistrictPatch, ExtraPage, Place, Person } from "@/lib/types";
import { catalog } from "@/lib/catalog";
import type { Sicht } from "@/lib/sicht";
import type { Quest, QuestStatus } from "@/lib/quest";
import { canonQuests } from "@/data/quests";
import type { Character } from "@/lib/wfrp";
import { migrateCharacter } from "@/lib/wfrp";

export type PlacePatch = Partial<
  Pick<
    Place,
    | "name"
    | "haus"
    | "familie"
    | "typ"
    | "stand"
    | "kanon"
    | "sieht"
    | "riecht"
    | "wer"
    | "geruecht"
    | "sl"
    | "am_tisch"
    | "spieltext"
    | "spielkern"
    | "szene"
    | "eskalation"
  >
>;

type CatalogState = {
  sicht: Sicht;
  notes: Record<string, string>;
  patches: Record<string, PlacePatch>;
  customPlaces: Place[];
  districtPatches: Record<string, DistrictPatch>;
  extraPages: ExtraPage[];
  extraPeople: Person[];
  wahrnehmung: number;
  revealed: Record<string, number[]>;
  library: Record<string, string[]>;
  keimOpen: Record<string, boolean>;
  quests: Quest[];
  party: Character[];
  setSicht: (v: Sicht) => void;
  setNote: (id: string, note: string) => void;
  patchPlace: (id: string, patch: PlacePatch) => void;
  upsertCustomPlace: (place: Place) => void;
  removeCustomPlace: (id: string) => void;
  patchDistrict: (key: string, patch: DistrictPatch) => void;
  upsertPage: (page: ExtraPage) => void;
  removePage: (id: string) => void;
  upsertPerson: (person: Person) => void;
  removePerson: (id: string) => void;
  setWahrnehmung: (n: number) => void;
  revealClue: (placeId: string, index: number) => void;
  clearRevealed: (placeId: string) => void;
  saveSnippet: (key: string, value: string) => void;
  dropSnippet: (key: string, value: string) => void;
  setKeimOpen: (placeId: string, open: boolean) => void;
  upsertQuest: (quest: Quest) => void;
  removeQuest: (id: string) => void;
  setQuestStatus: (id: string, status: QuestStatus) => void;
  upsertCharacter: (c: Character) => void;
  removeCharacter: (id: string) => void;
  importPacket: (packet: {
    patches?: Record<string, PlacePatch>;
    notes?: Record<string, string>;
    customPlaces?: Place[];
    districtPatches?: Record<string, DistrictPatch>;
    extraPages?: ExtraPage[];
    extraPeople?: Person[];
    quests?: Quest[];
  }) => void;
  resetCanon: () => void;
};

export const useCatalog = create<CatalogState>()(
  persist(
    (set) => ({
      sicht: "sl",
      notes: {},
      patches: {},
      customPlaces: [],
      districtPatches: {},
      extraPages: [],
      extraPeople: [],
      wahrnehmung: 35,
      revealed: {},
      library: {},
      keimOpen: {},
      quests: canonQuests,
      party: [],
      setSicht: (sicht) => set({ sicht }),
      setNote: (id, note) =>
        set((s) => ({ notes: { ...s.notes, [id]: note } })),
      patchPlace: (id, patch) =>
        set((s) => ({
          patches: { ...s.patches, [id]: { ...(s.patches[id] || {}), ...patch } },
        })),
      upsertCustomPlace: (place) =>
        set((s) => ({
          customPlaces: [
            ...s.customPlaces.filter((p) => String(p.id) !== String(place.id)),
            place,
          ],
        })),
      removeCustomPlace: (id) =>
        set((s) => ({
          customPlaces: s.customPlaces.filter((p) => String(p.id) !== String(id)),
        })),
      patchDistrict: (key, patch) =>
        set((s) => ({
          districtPatches: {
            ...s.districtPatches,
            [key]: { ...(s.districtPatches[key] || {}), ...patch },
          },
        })),
      upsertPage: (page) =>
        set((s) => ({
          extraPages: [...s.extraPages.filter((p) => p.id !== page.id), page],
        })),
      removePage: (id) =>
        set((s) => ({ extraPages: s.extraPages.filter((p) => p.id !== id) })),
      upsertPerson: (person) =>
        set((s) => ({
          extraPeople: [
            ...s.extraPeople.filter((p) => p.id !== person.id),
            person,
          ],
        })),
      removePerson: (id) =>
        set((s) => ({ extraPeople: s.extraPeople.filter((p) => p.id !== id) })),
      setWahrnehmung: (n) =>
        set({ wahrnehmung: Math.max(1, Math.min(99, Math.round(n) || 35)) }),
      revealClue: (placeId, index) =>
        set((s) => {
          const cur = s.revealed[placeId] || [];
          if (cur.includes(index)) return s;
          return { revealed: { ...s.revealed, [placeId]: [...cur, index] } };
        }),
      clearRevealed: (placeId) =>
        set((s) => {
          const next = { ...s.revealed };
          delete next[placeId];
          return { revealed: next };
        }),
      saveSnippet: (key, value) =>
        set((s) => {
          const text = value.trim();
          if (!text) return s;
          const cur = s.library[key] || [];
          if (cur.includes(text)) return s;
          return { library: { ...s.library, [key]: [text, ...cur].slice(0, 40) } };
        }),
      dropSnippet: (key, value) =>
        set((s) => ({
          library: {
            ...s.library,
            [key]: (s.library[key] || []).filter((v) => v !== value.trim()),
          },
        })),
      setKeimOpen: (placeId, open) =>
        set((s) => ({ keimOpen: { ...s.keimOpen, [placeId]: open } })),
      upsertQuest: (quest) =>
        set((s) => ({
          quests: [...s.quests.filter((q) => q.id !== quest.id), quest],
        })),
      removeQuest: (id) =>
        set((s) => ({ quests: s.quests.filter((q) => q.id !== id) })),
      setQuestStatus: (id, status) =>
        set((s) => ({
          quests: s.quests.map((q) => (q.id === id ? { ...q, status } : q)),
        })),
      upsertCharacter: (c) =>
        set((s) => ({
          party: [...s.party.filter((x) => x.id !== c.id), c],
        })),
      removeCharacter: (id) =>
        set((s) => ({ party: s.party.filter((x) => x.id !== id) })),
      importPacket: (packet) =>
        set((s) => ({
          patches: { ...s.patches, ...(packet.patches || {}) },
          notes: { ...s.notes, ...(packet.notes || {}) },
          customPlaces: mergeById(s.customPlaces, packet.customPlaces || []),
          districtPatches: { ...s.districtPatches, ...(packet.districtPatches || {}) },
          extraPages: mergePages(s.extraPages, packet.extraPages || []),
          extraPeople: mergePeople(s.extraPeople, packet.extraPeople || []),
          quests: mergeQuests(s.quests, packet.quests || []),
        })),
      resetCanon: () => set({ patches: {}, notes: {} }),
    }),
    {
      name: "drosselau.catalog.v2",
      merge: (persisted, current) => {
        const p = (persisted || {}) as Partial<CatalogState> & { hideSl?: boolean };
        const { hideSl, ...rest } = p;
        return {
          ...current,
          ...rest,
          sicht: rest.sicht ?? (hideSl ? "spieler" : "sl"),
          customPlaces: rest.customPlaces ?? [],
          districtPatches: rest.districtPatches ?? {},
          extraPages: rest.extraPages ?? [],
          extraPeople: rest.extraPeople ?? [],
          notes: rest.notes ?? {},
          patches: rest.patches ?? {},
          revealed: rest.revealed ?? {},
          wahrnehmung: rest.wahrnehmung ?? 35,
          library: rest.library ?? {},
          keimOpen: rest.keimOpen ?? {},
          quests:
            rest.quests && rest.quests.length >= 15
              ? rest.quests
              : canonQuests,
          party: (rest.party ?? []).map(migrateCharacter),
        };
      },
    },
  ),
);

function mergeById(base: Place[], extra: Place[]): Place[] {
  const map = new Map(base.map((p) => [String(p.id), p]));
  for (const p of extra) map.set(String(p.id), p);
  return [...map.values()];
}

function mergePages(base: ExtraPage[], extra: ExtraPage[]): ExtraPage[] {
  const map = new Map(base.map((p) => [p.id, p]));
  for (const p of extra) map.set(p.id, p);
  return [...map.values()];
}

function mergePeople(base: Person[], extra: Person[]): Person[] {
  const map = new Map(base.map((p) => [p.id, p]));
  for (const p of extra) map.set(p.id, p);
  return [...map.values()];
}

function mergeQuests(base: Quest[], extra: Quest[]): Quest[] {
  const map = new Map(base.map((q) => [q.id, q]));
  for (const q of extra) map.set(q.id, q);
  return [...map.values()];
}

export function mergePlace(place: Place, patches: Record<string, PlacePatch>): Place {
  const patch = patches[place.id] || patches[String(place.id)];
  return patch ? { ...place, ...patch, id: place.id } : place;
}

export function isCanonPlace(id: string): boolean {
  return catalog.places.some((p) => String(p.id) === String(id));
}
