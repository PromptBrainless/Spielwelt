import { catalog } from "@/data/catalog";
import type { District, ExtraPage, Place } from "@/lib/types";

export { catalog };

export function emptyPlace(input: {
  id: string;
  name: string;
  district: string;
  typ?: string;
  stand?: string;
  kanon?: string;
  sieht?: string;
  riecht?: string;
  wer?: string;
  geruecht?: string;
  sl?: string;
  am_tisch?: string;
}): Place {
  const d = catalog.districts.find((x) => x.key === input.district);
  return {
    id: input.id,
    name: input.name,
    district: input.district,
    district_num: d?.num ?? "",
    bezirk: d?.name ?? "",
    typ: input.typ ?? "",
    stand: input.stand ?? "Erweiterung",
    status_num: "",
    am_tisch: input.am_tisch ?? "",
    kanon: input.kanon ?? "",
    sieht: input.sieht ?? "",
    riecht: input.riecht ?? "",
    wer: input.wer ?? "",
    geruecht: input.geruecht ?? "",
    sl: input.sl ?? "",
    photo: `fotos/${input.id}.jpg`,
    kern: false,
    keim: "",
  };
}

export function slugId(name: string): string {
  const s = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return s || `neu-${Date.now().toString(36)}`;
}

export function allPlaces(extra: Place[] = []): Place[] {
  const map = new Map(catalog.places.map((p) => [String(p.id), p]));
  const order = catalog.places.map((p) => String(p.id));
  for (const p of extra) {
    const id = String(p.id);
    const prev = map.get(id);
    if (prev) {
      map.set(id, { ...prev, ...p, id: prev.id });
    } else {
      map.set(id, p);
      order.push(id);
    }
  }
  return order.map((id) => map.get(id)!);
}

export function districtByKey(key: string): District | undefined {
  return catalog.districts.find((d) => d.key === key);
}

export function placeById(id: string, extra: Place[] = []): Place | undefined {
  return allPlaces(extra).find((p) => String(p.id) === String(id));
}

export function placesInDistrict(key: string, extra: Place[] = []): Place[] {
  return allPlaces(extra).filter((p) => p.district === key);
}

export function hasPlay(place: Place): boolean {
  return Boolean(place.spieltext || place.spielkern || place.szene || place.eskalation);
}

export function displayName(place: Place): string {
  const haus = (place.haus || "").trim();
  if (haus) return haus;
  const familie = (place.familie || "").trim();
  if (familie) return `Haus ${familie}`;
  return place.name.replace(/\s+(Arbeit|Wohnen)$/i, "").trim();
}

export function tableTeaser(place: Place): string {
  const src = (place.spieltext || place.sieht || "").trim();
  if (!src) return "";
  const line = src.split(/\n/)[0].trim();
  if (line.length <= 150) return line;
  return `${line.slice(0, 147).replace(/\s+\S*$/, "")}…`;
}

export function searchBlob(place: Place, includeSl: boolean): string {
  const parts = [
    place.name,
    place.haus,
    place.familie,
    place.sieht,
    place.riecht,
    place.wer,
    place.typ,
    place.bezirk,
    place.spieltext,
    place.szene,
  ];
  if (includeSl) {
    parts.push(
      place.kanon,
      place.am_tisch,
      place.spielkern,
      place.geruecht,
      place.sl,
      place.eskalation,
    );
  }
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function photoSrc(place: { photo?: string; id: string }): string {
  if (place.photo) return `/${place.photo.replace(/^\//, "")}`;
  return `/fotos/${place.id}.jpg`;
}

export function coverSrc(district: District): string {
  const c = district.cover;
  if (c.includes(".")) return `/fotos/${c}`;
  return `/fotos/${c}.jpg`;
}

export function neighborPlaces(
  id: string,
  extra: Place[] = [],
): { prev?: Place; next?: Place } {
  const list = allPlaces(extra);
  const i = list.findIndex((p) => String(p.id) === String(id));
  if (i < 0) return {};
  return { prev: list[i - 1], next: list[i + 1] };
}

export function pageById(id: string, pages: ExtraPage[]): ExtraPage | undefined {
  return pages.find((p) => p.id === id);
}
