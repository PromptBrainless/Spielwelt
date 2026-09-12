import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DistrictPatch, ExtraPage, Place } from "@/lib/types";
import { catalog } from "@/lib/catalog";

export type PlacePatch = Partial<
  Pick<
    Place,
    | "name"
    | "typ"
    | "stand"
    | "kanon"
    | "sieht"
    | "riecht"
    | "wer"
    | "geruecht"
    | "sl"
    | "am_tisch"
  >
>;

type CatalogState = {
  hideSl: boolean;
  notes: Record<string, string>;
  patches: Record<string, PlacePatch>;
  customPlaces: Place[];
  districtPatches: Record<string, DistrictPatch>;
  extraPages: ExtraPage[];
  setHideSl: (v: boolean) => void;
  setNote: (id: string, note: string) => void;
  patchPlace: (id: string, patch: PlacePatch) => void;
  upsertCustomPlace: (place: Place) => void;
  removeCustomPlace: (id: string) => void;
  patchDistrict: (key: string, patch: DistrictPatch) => void;
  upsertPage: (page: ExtraPage) => void;
  removePage: (id: string) => void;
  importPacket: (packet: {
    patches?: Record<string, PlacePatch>;
    notes?: Record<string, string>;
    customPlaces?: Place[];
    districtPatches?: Record<string, DistrictPatch>;
    extraPages?: ExtraPage[];
  }) => void;
  resetCanon: () => void;
};

export const useCatalog = create<CatalogState>()(
  persist(
    (set) => ({
      hideSl: false,
      notes: {},
      patches: {},
      customPlaces: [],
      districtPatches: {},
      extraPages: [],
      setHideSl: (hideSl) => set({ hideSl }),
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
      importPacket: (packet) =>
        set((s) => ({
          patches: { ...s.patches, ...(packet.patches || {}) },
          notes: { ...s.notes, ...(packet.notes || {}) },
          customPlaces: mergeById(s.customPlaces, packet.customPlaces || []),
          districtPatches: { ...s.districtPatches, ...(packet.districtPatches || {}) },
          extraPages: mergePages(s.extraPages, packet.extraPages || []),
        })),
      resetCanon: () => set({ patches: {}, notes: {} }),
    }),
    {
      name: "drosselau.catalog.v1",
      merge: (persisted, current) => {
        const p = (persisted || {}) as Partial<CatalogState>;
        return {
          ...current,
          ...p,
          customPlaces: p.customPlaces ?? [],
          districtPatches: p.districtPatches ?? {},
          extraPages: p.extraPages ?? [],
          notes: p.notes ?? {},
          patches: p.patches ?? {},
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

export function mergePlace(place: Place, patches: Record<string, PlacePatch>): Place {
  const patch = patches[place.id];
  return patch ? { ...place, ...patch } : place;
}

export function isCanonPlace(id: string): boolean {
  return catalog.places.some((p) => String(p.id) === String(id));
}
