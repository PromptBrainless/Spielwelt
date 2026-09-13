/** Ämter, wie das Heft sie nennt. Personen aus der Namensbereinigung. */
export type Amt = {
  name: string;
  stand: string;
  place: string;
  alsoAt?: string[];
  who: string;
  does: string;
};

export const aemter: Amt[] = [
  {
    name: "Zoll / Torwache",
    stand: "Amt",
    place: "7",
    alsoAt: ["Nordtor", "14"],
    who: "Arne Falk",
    does: "Einziges Haus mit Stand Amt. Zoll in Groschen. Waffen, Mutation. Nadelöhr. Wohnen: Torstraße 8.",
  },
  {
    name: "Nordtor",
    stand: "Erweiterung",
    place: "Nordtor",
    alsoAt: ["7"],
    who: "Bram Holt, Schicht",
    does: "Ankunft ist öffentlich. Dieselbe Schwelle wie das Zollhaus, kein zweites Amt.",
  },
  {
    name: "Rat / Gericht",
    stand: "Silber",
    place: "21",
    who: "Helmuth Kirchweger; Johann, Gehilfe",
    does: "Größtes Haus am Platz, trotzdem Fleckenmaß. Kein Palast.",
  },
  {
    name: "Stadtrat",
    stand: "Silber",
    place: "17",
    alsoAt: ["Pranger"],
    who: "Reiner Ohlendorf",
    does: "Wohnung mit Fenster zum Platz und zum Pfahl. Öffentlichkeit ist die Strafe. Nebenlinie am Tor (81).",
  },
  {
    name: "Pranger",
    stand: "Erweiterung",
    place: "Pranger",
    alsoAt: ["17"],
    who: "",
    does: "Keine Folterkammer. Öffentlichkeit ist die Strafe.",
  },
  {
    name: "Waage / Marktaufsicht",
    stand: "Erweiterung",
    place: "19",
    who: "Emil Kant",
    does: "Maß und Streit. Betrug ist Alltag.",
  },
  {
    name: "Notar des Grafen",
    stand: "Silber",
    place: "20",
    who: "Leopold Dorn; Agnes kopiert",
    does: "Siegel von Grünberg. Bruder: Albrecht Dorn am Tor (75). Der Graf sitzt nicht in der Stadt.",
  },
  {
    name: "Kaufmannsgilde",
    stand: "Gilde",
    place: "16",
    who: "Wilhelm Reichart",
    does: "Sitz Marktplatz 1, Wohnung Gildengasse 2. Keine Kathedrale, nur Gilde.",
  },
  {
    name: "Handwerkerzunft",
    stand: "Gilde",
    place: "25",
    who: "",
    does: "Sammelzunft. Lager und Archiv. Arbeit, nicht Wohnen.",
  },
  {
    name: "Gildeschreiber",
    stand: "Silber",
    place: "27",
    who: "Franz Rautenberg",
    does: "Schreibt für die Gilde, wohnt privat.",
  },
  {
    name: "Stadtwache",
    stand: "—",
    place: "14",
    alsoAt: ["7", "15", "Marktbrunnen", "Osttor"],
    who: "Arne Falk (Zollhaus); Bram Holt (Nordtor); Heinz Laub (Osttor)",
    does: "Macht klein und nah. Kein Kerkerpalast. Schichtzeiten.",
  },
  {
    name: "Sigmar, Stadtpatron",
    stand: "Silber",
    place: "18",
    who: "Brant Amsberg; Novize Jost",
    does: "Hauptkultstätte. Macht dünn. Kein Turm, kein Marmor. Kult, nicht Amt.",
  },
  {
    name: "Morr",
    stand: "Silber / Messing",
    place: "56",
    alsoAt: ["55", "Garten", "Osttor"],
    who: "Miren Amsel; Silas Wehming",
    does: "Trauer, Garten, Osttor. Dienst, nicht Stadtamt.",
  },
  {
    name: "Steuer in der Vorstadt",
    stand: "Erweiterung",
    place: "71",
    who: "Runa Lenz",
    does: "Nicht das Zollhaus. Hebamme, rechnet wer sich Kalk leisten kann.",
  },
];

export function amtAt(placeId: string): Amt[] {
  const id = String(placeId);
  return aemter.filter((a) => a.place === id || a.alsoAt?.includes(id));
}
