/** Drei Keime, still, bis der SL zieht. Nur diese drei. */
export type Keim = {
  n: "1" | "2" | "3";
  place: string;
  street: string;
  name: string;
  still: string;
  pull: string;
};

export const keime: Keim[] = [
  {
    n: "1",
    place: "69",
    street: "Rattenwinkel 2",
    name: "Letztes leerstehendes Gebäude",
    still: "Nachbarn meiden es. Ratten, Kratzgeräusche, Verwesungsgeruch. Nicht betreten lassen ohne Preis.",
    pull: "Aberglaube oder nicht — nur SL. Zu herrschaftlich: als Narbe und Fehlstelle erzählen, nicht als Adelssitz voller Diener. Das Haus stand bevor Drosselau Flecken war.",
  },
  {
    n: "2",
    place: "62",
    street: "Bettelgasse 3",
    name: "Hütte der Ordnung",
    still: "Krumm, Fips, Auge. Geburtsnamen unbekannt. Munkeln über Kulte. Still, bis der SL öffnet.",
    pull: "Feuerkreis als Bühne. Foto hat Menge — am Tisch entscheiden: heute voll oder leer. Wer in den Kreis tritt ohne gefragt zu sein, zahlt mit einem Geheimnis.",
  },
  {
    n: "3",
    place: "30",
    street: "Marktplatz 10",
    name: "Leerstehendes Kontor",
    still: "Auswärtige Kompanie, seit einem Jahr weg. Kein Wohnhaus. Nicht Reicharts Haus.",
    pull: "Zwei Tore, ein Schlüsselbund. Einbruchsszene oder Siegel. Ein Tor lässt sich von innen nicht öffnen.",
  },
];

export function keimAt(placeId: string): Keim | undefined {
  return keime.find((k) => k.place === String(placeId));
}

export function keimeInDistrict(district: string): Keim[] {
  if (district === "6-schatten") return keime.filter((k) => k.n === "1" || k.n === "2");
  if (district === "3-markt") return keime.filter((k) => k.n === "3");
  return [];
}
