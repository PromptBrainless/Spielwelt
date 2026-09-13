/** Gilde und Zunft. Namen aus der Bereinigung. */
export type GildeOrt = {
  name: string;
  stand: string;
  place: string;
  alsoAt?: string[];
  who: string;
  does: string;
};

export const gilde: GildeOrt[] = [
  {
    name: "Kaufmannsgilde",
    stand: "Gilde",
    place: "16",
    alsoAt: ["29"],
    who: "Wilhelm Reichart",
    does: "Marktplatz 1. Preise und Namen. Haus der Gilde, nicht die Wohnung.",
  },
  {
    name: "Wohnung Reichart",
    stand: "Silber",
    place: "29",
    alsoAt: ["16"],
    who: "Wilhelm, Elsa Reichart",
    does: "Gildengasse 2. Tagung und Schlafen sind zwei Adressen.",
  },
  {
    name: "Haus Reichart",
    stand: "Silber",
    place: "22",
    who: "Berthold, Saskia, Emmerich, Liese",
    does: "Marktplatz 7. Sohn des Gildemeisters. Zwei Türen: Ware links, Leute rechts.",
  },
  {
    name: "Haus Halbritter",
    stand: "Silber",
    place: "84",
    who: "Kaspar, Hilda; Pieter auf der Reik",
    does: "Marktplatz 8. Andere Familie als Reichart. Erker sieht Ankunft und Pranger.",
  },
  {
    name: "Handwerkerzunft",
    stand: "Gilde",
    place: "25",
    alsoAt: ["26", "83"],
    who: "",
    does: "Marktplatz 2. Sammelzunft. Arbeit, nicht Wohnen.",
  },
  {
    name: "Lagerhaus der Zunft",
    stand: "kein Wohnen",
    place: "26",
    alsoAt: ["25"],
    who: "Eckhard Stumm, Nachtwächter",
    does: "Gildengasse 1. Hintere Kammer versiegelt seit dem letzten Hungerjahr.",
  },
  {
    name: "Zunftarchiv",
    stand: "kein Wohnen",
    place: "83",
    alsoAt: ["25"],
    who: "",
    does: "Gildengasse 5. Steuerlisten, Meisterbriefe.",
  },
  {
    name: "Herberge für Zunftbrüder",
    stand: "keine Wohnfamilie",
    place: "24",
    who: "",
    does: "Gildengasse 4. Durchreisende Gesellen. Oben/unten zwei Szenen.",
  },
  {
    name: "Gildeschreiber",
    stand: "Silber",
    place: "27",
    who: "Franz Rautenberg",
    does: "Gildengasse 3. Schreibt für die Gilde.",
  },
  {
    name: "Leeres Kontor",
    stand: "leer",
    place: "30",
    who: "",
    does: "Marktplatz 10. Keim still. Zwei Tore, ein Schlüsselbund. Nicht Reicharts Haus.",
  },
];

export function gildeAt(placeId: string): GildeOrt[] {
  const id = String(placeId);
  return gilde.filter((a) => a.place === id || a.alsoAt?.includes(id));
}

export const GILDE_DISTRICT = "3-markt";
export const AMT_DISTRICTS = ["2-tor", "3-markt"];
