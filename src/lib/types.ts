export type District = {
  key: string;
  num: string;
  name: string;
  short: string;
  intro: string;
  fabric: string;
  cover: string;
};

export type Place = {
  id: string;
  name: string;
  district_num: string;
  bezirk: string;
  typ: string;
  stand: string;
  status_num: string | number;
  am_tisch: string;
  kanon: string;
  sieht: string;
  riecht: string;
  wer: string;
  geruecht: string;
  sl: string;
  district: string;
  photo: string;
  kern: boolean;
  keim: string;
};

export type Pack = {
  pack: number;
  qa: boolean;
  ids: string[];
  bezirk: string;
  qa_pct?: number;
  note?: string;
};

export type ExtraPage = {
  id: string;
  title: string;
  body: string;
  district?: string;
};

export type DistrictPatch = Partial<Pick<District, "intro" | "fabric" | "name">>;

export type Catalog = {
  title: string;
  subtitle: string;
  year: string;
  count: number;
  districts: District[];
  places: Place[];
  queue: Pack[];
  laws: string[];
  abgleich: string[];
};

export type CatalogPacket = {
  v: 1;
  patches: Record<string, Record<string, string>>;
  notes: Record<string, string>;
  customPlaces: Place[];
  districtPatches: Record<string, DistrictPatch>;
  extraPages: ExtraPage[];
  images?: Record<string, string>;
};
