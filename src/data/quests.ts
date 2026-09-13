import { emptyQuest, type Quest, type QuestVariant } from "@/lib/quest";

function V(
  key: QuestVariant["key"],
  player: string,
  npcs: string,
  ruf: string,
  next: string,
  fight: boolean,
  consequence: string,
): QuestVariant {
  return { key, player, npcs, ruf, next, fight, consequence };
}

function Q(
  id: string,
  name: string,
  series: string,
  follow: string,
  requires: string,
  patch: (q: Quest) => void,
): Quest {
  const q = emptyQuest(id, name);
  q.series = series;
  q.follow = follow;
  q.requires = requires;
  q.status = "still";
  q.repeatable = false;
  q.priority = "normal";
  q.triggers[0].id = `${id}-t1`;
  q.goals[0].id = `${id}-g1`;
  q.tree[0].id = `${id}-d1`;
  patch(q);
  return q;
}

const KONTOR = "Das Kontor";
const ORDNUNG = "Die Ordnung";
const RATTEN = "Rattenwinkel";

export const canonQuests: Quest[] = [
  Q("q-1-1", "Der leere Laden", KONTOR, "q-1-2", "", (q) => {
    q.type = "Intrige";
    q.difficulty = "mittel";
    q.faction = "Gilde";
    q.region = "3-markt";
    q.career = "";
    q.triggers = [
      { id: "q-1-1-t1", kind: "Gebiet betreten", place: "30", npc: "", condition: "Keim 3 nicht ziehen. Nur die Leere.", chance: "immer", once: false },
      { id: "q-1-1-t2", kind: "Gerücht", place: "Marktbrunnen", npc: "", condition: "jemand steht am Brunnen", chance: "immer", once: false },
      { id: "q-1-1-t3", kind: "Händler", place: "88", npc: "kraemer-pergel", condition: "sie kaufen oder fragen nach Nummer 10", chance: "immer", once: true },
      { id: "q-1-1-t4", kind: "Gespräch", place: "16", npc: "wilhelm-reichart", condition: "sie reden am Sitz, nicht in der Wohnung", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "kraemer-pergel",
      name: "Pergel",
      race: "Mensch",
      age: "",
      role: "Kleinhändler",
      faction: "keine",
      alignment: "offen",
      status: "Messing",
      ties: "Markt, Waage",
      enemies: "die Leere stiehlt ihm Kunden",
      secrets: "hat selbst von den alten Kunden genommen, so weit er durfte",
      motive: "jemand anderes soll die Gilde ärgern",
      fear: "dass man ihn als Nächstes leert",
      goals: "dass Nummer 10 aufhört, still zu verdienen",
    };
    q.story = {
      believes: "Die Kompanie ist beim Hochwasser abgehauen. Die Gilde füllt Lücken. So ist Handel.",
      happened: "In einer Nacht ohne Kirchenbucheintrag wurden Rechte umgeschrieben. Das Haus wurde geleert, nicht geplündert.",
      twist: "Wer so aufräumt, hatte Schlüssel und Zeit. Reichart lächelt seither breiter.",
      truth: "Noch nicht die Brüder. Nur: wessen Mund sie zuerst tragen.",
    };
    q.goals = [{
      id: "q-1-1-g1",
      text: "Wer redet wahr über Nummer 10.",
      kind: "Entscheiden",
      required: true,
      progress: 0,
      fail: "Sie lassen 30 links liegen. Die Leere bleibt Gerücht.",
      success: "Sie haben Reichart oder das Gemunkel zum ersten Halt gemacht.",
      reward: "Ein Mund merkt sich, wem sie zuerst glaubten.",
    }];
    q.world = {
      npcs: "Pergel hält den Mund oder Reichart lächelt breiter.",
      dialogs: "Kant wiegt genauer, wenn sie gegen die Gilde standen.",
      places: "An 30 ein neues Schloss, wenn die Krämer geglaubt wurden.",
      traders: "Pergel will nicht mehr am Brunnen gesehen werden, oder er bleibt.",
      enemies: "",
      factions: "Gilde merkt, wessen Ohr offen war.",
    };
    q.tree = [
      { id: "q-1-1-d1", label: "Reichart glauben", outcome: "Die Leere ist Ordnung. q-1-2 nur wenn sie selbst nach 20 gehen.", children: [] },
      { id: "q-1-1-d2", label: "Den Krämern glauben", outcome: "Die Leere ist Diebstahl. Spur 20 oder 75.", children: [] },
      { id: "q-1-1-d3", label: "Nichts tun", outcome: "Stadt wie gehabt. q-1-2 bleibt zu.", children: [] },
    ];
    q.rewards = { groschen: "höchstens ein Groschen von Pergel, der nach Kupfer schmeckt", xp: "", items: "", ruf: "wer zuerst geglaubt wurde", ties: "Pergel oder Reichart", world: "Schloss oder Schweigen", unlocks: "q-1-2 wenn eine Seite geglaubt", faction: "Gilde merkt" };
    q.lore = { places: "30, Marktbrunnen, 19, 88, 16", factions: "Gilde", people: "Reichart, Pergel, Kant", events: "Hochwasser vor einem Jahr, Kompanie weg", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Fragen am Sitz.", "Reichart: Leer ist leer. Der Reik hat sie geholt.", "Gilde ruhig", "q-1-2 nur selbst", false, "Leere bleibt Ordnung."),
      V("alternativ", "Bei Pergel kaufen und nach 10 fragen.", "Pergel spuckt, hält dann den Mund.", "Krämer offen", "20 oder 75", false, "Diebstahl-Lesart."),
      V("kreativ", "Zwei Tore zählen, Staublinien.", "Niemand. Das Gerücht steht schon im Heft.", "", "Waage", false, "Fundstück, kein Mund."),
      V("chaotisch", "Schloss aufbrechen.", "Schicht klein, Kant ruft.", "Gilde sauer", "", false, "Alltag zerbricht, kein Kampfzwang."),
      V("böse", "Feuer an 30.", "Kant ruft die Schicht. Reichart vergisst den Namen nicht.", "tot bei der Gilde", "", true, "Ruf tot."),
    ];
    q.actions = "Wahrscheinliches / anderer Weg / kreativ / chaotisch / böse — eine Variante, nicht alle.";
    q.nodes = {
      trigger: "30 betreten (Keim still). Brunnen. Pergel 88. Reichart 16.",
      geber: "Pergel. Reichart ist der andere Mund, kein Geber.",
      aufgabe: "Wer redet wahr über Nummer 10.",
      hinweise: "Zu sauber. Zwei Tore. Krämer verlieren Kunden. Reichart lächelt.",
      konflikt: "Ordnung gegen Diebstahl. Beide Lügen zur Hälfte.",
      entscheidung: "Reichart / Krämer / nichts.",
      konsequenz: "Ein Mund ändert sich. Kein Siegel noch.",
      belohnung: "Kein Lohn. Ein Ohr ist markiert.",
      welt: "Schloss oder Schweigen beim nächsten Besuch.",
      folge: "q-1-2 Siegel, nur wenn eine Seite geglaubt.",
    };
  }),

  Q("q-1-2", "Das Siegel des Grafen", KONTOR, "q-1-3", "q-1-1", (q) => {
    q.type = "Intrige";
    q.difficulty = "hart";
    q.faction = "Gilde";
    q.region = "3-markt";
    q.triggers = [
      { id: "q-1-2-t1", kind: "Gespräch", place: "20", npc: "leopold-dorn", condition: "sie wollen ein Papier sehen", chance: "immer", once: true },
      { id: "q-1-2-t2", kind: "Fundstück", place: "20", npc: "agnes-dorn", condition: "Agnes kopiert, wenn Leopold draußen ist", chance: "Würfel", once: true },
    ];
    q.giver = {
      npcId: "leopold-dorn", name: "Leopold Dorn", race: "Mensch", age: "39", role: "Notar des Grafen",
      faction: "Amt/Gilde", alignment: "offen", status: "Silber",
      ties: "Agnes kopiert; Bruder Albrecht 75", enemies: "wer das Datum liest",
      secrets: "eine Übertragung in einer Nacht, die das Kirchenbuch nicht kennt",
      motive: "das Siegel soll unantastbar bleiben", fear: "Fälschung am eigenen Finger",
      goals: "sie abwimmeln, bestechen oder erpressen lassen — Hauptsache das Blatt bleibt",
    };
    q.story = {
      believes: "Der Notar bewahrt Recht. Das Grafensiegel lügt nicht.",
      happened: "Eine Übertragung von Handelsrechten, datiert auf eine Nacht ohne Ein- oder Ausgang.",
      twist: "Leopold hat gesiegelt. Der Graf sitzt nicht in der Stadt. Der Bruder verdient seither.",
      truth: "Das Datum ist der Diebstahl. Das Siegel macht ihn legal.",
    };
    q.goals = [{
      id: "q-1-2-g1", text: "Das Datum sehen.", kind: "Infiltrieren", required: true, progress: 0,
      fail: "Kein Blatt. Leopold schickt sie zum Rat, der sie nicht empfängt.",
      success: "Sie kennen die Nacht, die es amtlich nicht gab.",
      reward: "Hebel gegen Leopold oder Albrecht.",
    }];
    q.world = { npcs: "Leopold trockener. Agnes schreibt langsamer.", dialogs: "Agnes flüstert nur noch Preise für Tinte.", places: "20: ein Fach bleibt zu.", traders: "", enemies: "Albrecht hört, dass gefragt wurde.", factions: "Gilde oder Rat, je nach Weg." };
    q.tree = [
      { id: "q-1-2-d1", label: "Bestechen", outcome: "Groschen. Blatt für eine Stunde. Leopold behält eine Abschrift ihrer Namen.", children: [] },
      { id: "q-1-2-d2", label: "Überzeugen", outcome: "Agnes zeigt die Kopie, nicht das Siegel. Leopold erfährt es.", children: [] },
      { id: "q-1-2-d3", label: "Mit dem Bruder erpressen", outcome: "Tür auf. Feindschaft fest. q-1-3 liegt offen und scharf.", children: [] },
    ];
    q.rewards = { groschen: "wenn sie zahlen, weg. wenn sie erpressen, keines", xp: "", items: "kein Blatt mitnehmen — Abschrift ist schon Verrat", ruf: "bei Dorn oder gegen Dorn", ties: "Agnes oder tot", world: "Fach zu", unlocks: "q-1-3", faction: "Siegelmacht" };
    q.lore = { places: "20, 18 Kirchenbuch nur als Drohung nicht als Ort", factions: "Grafensiegel, Gilde", people: "Leopold, Agnes, Albrecht", events: "Nacht ohne Eintrag", when: "2512 IZ, die Nacht vor einem Jahr" };
    q.variants = [
      V("wahrscheinlich", "Um Einsicht bitten.", "Leopold: Das Siegel ist nicht für Gesindel.", "kalt", "", false, "Abgewiesen."),
      V("alternativ", "Agnes allein.", "Sie kopiert. Tinte auf den Fingern.", "leise", "q-1-3", false, "Kopie, nicht Original."),
      V("kreativ", "Kirchenbuch gegen das Datum halten — bei Amsberg nachfragen ohne den Inhalt zu nennen.", "Brant will Namen hören, nicht Nächte.", "", "18", false, "Kein Kult, nur ein Buch."),
      V("chaotisch", "Fach aufbrechen.", "Schicht. Leopold ruft nicht laut — er schreibt.", "feind", "q-1-3", false, "Alltag zerbricht."),
      V("böse", "Agnes drohen.", "Leopold zahlt später mit dem Bruder.", "Gilde hört", "q-1-3", true, "Erpressung liegt."),
    ];
    q.actions = "Bestechen, überzeugen, Bruder. Eine.";
    q.nodes = {
      trigger: "20 Leopold. Agnes wenn er draußen ist.",
      geber: "Leopold. Motiv: Siegel unantastbar. Angst: eigene Finger.",
      aufgabe: "Das Datum sehen.",
      hinweise: "Nacht ohne Eintrag. Bruder verdient. Agnes kopiert alles.",
      konflikt: "Recht gegen Datum.",
      entscheidung: "Bestechen / überzeugen / Bruder.",
      konsequenz: "Hebel oder Feindschaft.",
      belohnung: "Kein Blatt als Beute. Die Nacht im Kopf.",
      welt: "Fach zu. Albrecht hört.",
      folge: "q-1-3 Zwei Brüder.",
    };
  }),

  Q("q-1-3", "Zwei Brüder, ein Geheimnis", KONTOR, "q-1-4", "q-1-2", (q) => {
    q.type = "Intrige";
    q.difficulty = "hart";
    q.faction = "Gilde";
    q.region = "2-tor";
    q.triggers = [
      { id: "q-1-3-t1", kind: "Gespräch", place: "75", npc: "albrecht-dorn", condition: "sie kennen das Datum oder den Bruder", chance: "immer", once: true },
      { id: "q-1-3-t2", kind: "Händler", place: "75", npc: "cyprian", condition: "Cyprian führt Bücher, Albrecht ist am Tor", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "albrecht-dorn", name: "Albrecht Dorn", race: "Mensch", age: "", role: "Kaufmann",
      faction: "Gilde", alignment: "offen", status: "Silber",
      ties: "Bruder Leopold; Cyprian schreibt", enemies: "Halbritter, wer öffentlich macht",
      secrets: "führt Geschäfte, die der Kompanie gehörten",
      motive: "Familie vor Stadt", fear: "öffentlich = Gilde lässt ihn fallen oder frisst ihn ganz",
      goals: "decken lassen. zahlen. nicht am Pranger.",
    };
    q.story = {
      believes: "Zwei Kaufleute, gleicher Name, Zufall am Tor.",
      happened: "Brüder. Ein Siegel, ein Kontor, ein Jahr Gewinn.",
      twist: "Decken hält die Familie. Öffentlich machen hält die Gilde — oder zerreißt beides.",
      truth: "Ruf gegen Rückhalt. Beides kostet. Nichts ist rein.",
    };
    q.goals = [{
      id: "q-1-3-g1", text: "Die Brüder halten oder an den Platz nageln.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Albrecht kauft jemand anderen. Die Spur erkaltet.",
      success: "Decken oder öffentlich. Eine von beiden liegt.",
      reward: "Rückhalt bei der Familie oder ein Name am Brunnen.",
    }];
    q.world = { npcs: "Cyprian verschwindet drei Tage oder schreibt lauter.", dialogs: "Leopold empfängt nicht mehr, oder nur sie.", places: "75: Laden zu oder prächtiger.", traders: "Halbritter hört alles.", enemies: "wer öffentlich machte, ist markiert", factions: "Gilde rückt zusammen oder stößt einen ab." };
    q.tree = [
      { id: "q-1-3-d1", label: "Decken", outcome: "Silber. Schweigen. Gilde bleibt Freund. Halbritter allein.", children: [] },
      { id: "q-1-3-d2", label: "Öffentlich", outcome: "Brunnen. Pranger droht nicht — Gerücht reicht. Gilde kalt.", children: [] },
      { id: "q-1-3-d3", label: "Beiden Brüdern getrennt verkaufen", outcome: "Kurzes Silber, zwei Feinde. q-1-4 wird eng.", children: [] },
    ];
    q.rewards = { groschen: "decken: ja. öffentlich: nein", xp: "", items: "", ruf: "Familie oder Markt", ties: "Dorn oder tot", world: "Laden zu oder glänzend", unlocks: "q-1-4", faction: "Gilde" };
    q.lore = { places: "75, 20", factions: "Gilde", people: "Albrecht, Leopold, Cyprian, Halbritter", events: "übernommene Kunden", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Kauf, dann fragen.", "Albrecht spricht von Hochwasser.", "neutral", "", false, "Leugnen."),
      V("alternativ", "Cyprian und die Bücher.", "Zahlen ohne Namen der alten Kompanie — durchgestrichen.", "", "q-1-4", false, "Spur in der Tinte."),
      V("kreativ", "Dieselbe Hand in 20 und 75 vergleichen.", "Agnes' Kopie gegen Cyprians Liste.", "", "", false, "Kein neuer NPC."),
      V("chaotisch", "Im Laden schreien.", "Torwache. Bram Holt will keinen Aufruhr am Zoll.", "laut", "", false, "Öffentlich ohne Plan."),
      V("böse", "Cyprian die Hand.", "Albrecht zahlt sofort. Hasst für immer.", "Gilde hört", "q-1-4", true, "Decken unter Zwang."),
    ];
    q.actions = "Decken kostet die Stadt. Öffentlich kostet euch.";
    q.nodes = {
      trigger: "75 Albrecht oder Cyprian.",
      geber: "Albrecht. Familie vor Stadt.",
      aufgabe: "Halten oder nageln.",
      hinweise: "Durchgestrichene Kundennamen. Bruder siegelt. Halbritter sieht den Erker.",
      konflikt: "Ruf gegen Rückhalt.",
      entscheidung: "Decken / öffentlich / beiden verkaufen.",
      konsequenz: "Gilde Freund oder kalt.",
      belohnung: "Silber oder ein Name am Brunnen.",
      welt: "Laden zu oder prächtig.",
      folge: "q-1-4 Ratshaus oder Gildehaus.",
    };
  }),

  Q("q-1-4", "Ratshaus oder Gildehaus", KONTOR, "q-1-5", "q-1-3", (q) => {
    q.type = "Politisch";
    q.difficulty = "hart";
    q.faction = "Gilde";
    q.region = "3-markt";
    q.triggers = [
      { id: "q-1-4-t1", kind: "Gespräch", place: "21", npc: "helmuth-kirchweger", condition: "sie wollen den Rat, nicht das Amt", chance: "immer", once: true },
      { id: "q-1-4-t2", kind: "Fraktion", place: "16", npc: "wilhelm-reichart", condition: "sie kommen mit Datum oder Brüdern", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "helmuth-kirchweger", name: "Helmuth Kirchweger", race: "Mensch", age: "46", role: "Mann im Ratshaus",
      faction: "Silber", alignment: "offen", status: "Silber",
      ties: "Mathilde, Johann; Marsold kennt seine Schulden", enemies: "wer die Schulden laut sagt",
      secrets: "hat in jener Nacht ein Auge zugedrückt, weil Marsold die Tiefe zeigte",
      motive: "das Ratshaus soll stehen bleiben, auch auf kranker Milch",
      fear: "Gilde zieht das Geld ab",
      goals: "sie an sich binden oder an Reichart abschieben",
    };
    q.story = {
      believes: "Der Rat hält Recht, die Gilde den Markt. Man wählt anständig.",
      happened: "Kirchweger lebt von Gildengeld. Reichart lächelt, weil der Rat nichts kann ohne ihn.",
      twist: "Vertrauen ist Schulden, nicht Treue. Langfristig heißt: wessen Silber euch nährt.",
      truth: "Es gibt keine dritte Bank in Drosselau.",
    };
    q.goals = [{
      id: "q-1-4-g1", text: "Wessen Haus trägt euch.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Beide weisen sie ab. q-1-5 ohne Patron — härter.",
      success: "Ein Patron. Der andere merkt es.",
      reward: "Zugang zum Finale unter einem Dach.",
    }];
    q.world = { npcs: "Johann schreibt den Namen in ein Buch oder streicht ihn.", dialogs: "Marsold wechselt genauer, wenn der Rat gewählt wurde.", places: "21 oder 16 empfängt, das andere nicht.", traders: "", enemies: "der nicht Gewählte", factions: "Silber gegen Gilde, öffentlich leise." };
    q.tree = [
      { id: "q-1-4-d1", label: "Kirchweger", outcome: "Rat deckt. Gilde kalt. Finale gegen Reichart.", children: [] },
      { id: "q-1-4-d2", label: "Reichart", outcome: "Gilde deckt. Rat taub. Finale als Werkzeug der Gilde.", children: [] },
      { id: "q-1-4-d3", label: "Beiden dienen", outcome: "Kurzes Spiel. Beide erfahren es. Finale ohne Dach.", children: [] },
    ];
    q.rewards = { groschen: "kein Sold, nur Dach", xp: "", items: "", ruf: "ein Haus", ties: "Kirchweger oder Reichart", world: "eine Tür zu", unlocks: "q-1-5", faction: "Silber oder Gilde" };
    q.lore = { places: "21, 16, 23 Marsold nur als Hebel", factions: "Ratshaus, Gilde", people: "Kirchweger, Reichart, Marsold, Johann", events: "Auge zugedrückt", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Um Audienz bitten.", "Johann nimmt den Namen. Warten.", "leise", "", false, "Schreiber zuerst."),
      V("alternativ", "Mit Datum zu Reichart.", "Er lächelt. Bietet Teilhabe, nicht Recht.", "Gilde", "q-1-5", false, "Werkzeug."),
      V("kreativ", "Marsold nach Schulden fragen ohne den Rat zu nennen.", "Ute schickt sie raus. Magnus bleibt.", "", "23", false, "Heft-Gerücht, kein neuer Mund."),
      V("chaotisch", "Im Ratshaus das Datum schreien.", "Öffentlichkeit. Beide müssen sich stellen — gegen euch.", "laut", "q-1-5", false, "Ohne Patron."),
      V("böse", "Johann das Buch nehmen.", "Wache. Kirchweger zahlt die Schicht aus der Gildenkasse.", "feind", "", true, "Beide gegen euch."),
    ];
    q.actions = "Ein Dach. Nicht zwei.";
    q.nodes = {
      trigger: "21 Kirchweger. 16 Reichart mit Datum.",
      geber: "Kirchweger als Mann, nicht als Amt-Stand. Reichart der andere Pol.",
      aufgabe: "Wessen Haus trägt euch.",
      hinweise: "Schulden bei Marsold. Gildengeld im Rat. Lächeln am Sitz.",
      konflikt: "Silber gegen Gilde. Keine dritte Bank.",
      entscheidung: "Rat / Gilde / beiden dienen.",
      konsequenz: "Ein Patron, ein Feind.",
      belohnung: "Dach, kein Sold.",
      welt: "Eine Tür zu.",
      folge: "q-1-5 Wem gehört das Kontor.",
    };
  }),

  Q("q-1-5", "Wem gehört das Kontor", KONTOR, "", "q-1-4", (q) => {
    q.type = "Politisch";
    q.difficulty = "hart";
    q.priority = "hoch";
    q.faction = "Gilde";
    q.region = "3-markt";
    q.triggers = [
      { id: "q-1-5-t1", kind: "Gebiet betreten", place: "30", npc: "", condition: "Keim 3 nur wenn SL schon gezogen hat. Sonst bleibt es Leerstand mit neuem Schloss.", chance: "immer", once: true },
      { id: "q-1-5-t2", kind: "Gespräch", place: "84", npc: "kaspar-halbritter", condition: "er weiß, dass sie wissen", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "kaspar-halbritter", name: "Kaspar Halbritter", race: "Mensch", age: "41", role: "Kaufmann",
      faction: "keine", alignment: "offen", status: "Silber",
      ties: "Hilda; Pieter auf der Reik", enemies: "Reichart, die Brüder",
      secrets: "weiß, dass er der Nächste ist",
      motive: "überleben, nicht siegen", fear: "geleert wie die Fremden",
      goals: "das Kontor nicht der Gilde lassen — oder selbst ein Stück, wenn es das Leben kauft",
    };
    q.story = {
      believes: "Ein Handelsposten braucht einen Herren. Wer ihn bekommt, hat Recht.",
      happened: "Das Kontor ist tot. Wer es bekommt, verschiebt den Markt dauerhaft.",
      twist: "Halbritter warnen macht euch sichtbar. Selbst nehmen macht euch zur Gilde. Nichts tun lässt Halbritter später fehlen.",
      truth: "Morr begräbt niemanden dafür. Die Macht am Platz ändert sich trotzdem.",
    };
    q.goals = [{
      id: "q-1-5-g1", text: "Wer steht in Nummer 10, wenn der Regen wieder kommt.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Niemand. Schloss bleibt. Gilde nutzt es ohne Schild.",
      success: "Ein Name am Tor — Halbritter, Reichart, Albrecht, oder ihr.",
      reward: "Markt verschoben. Keine Gerechtigkeit.",
    }];
    q.world = { npcs: "Halbritter redet anders oder fehlt in drei Wochen.", dialogs: "Pergel grüßt den neuen Herren oder nicht.", places: "30: Schild, oder weiter leer mit Schlüssel in 16.", traders: "Wer den Posten hat, hat Winterkorn-Nähe.", enemies: "wer verlor", factions: "Gilde enger oder gespalten." };
    q.tree = [
      { id: "q-1-5-d1", label: "Halbritter den Posten", outcome: "Er lebt länger. Gilde hasst. Ihr seid Ohren, die man stopfen muss.", children: [] },
      { id: "q-1-5-d2", label: "Stück für Schweigen", outcome: "Albrecht oder Reichart zahlt. Ihr seid drin. Nächster Fremder, derselbe Weg.", children: [] },
      { id: "q-1-5-d3", label: "Nichts", outcome: "Stadt wie sie war. Halbritter kauft sich frei oder fehlt.", children: [] },
    ];
    q.rewards = { groschen: "Schweigen: ja. Warnen: nein", xp: "", items: "Schlüsselbund von 30, wenn SL Keim gezogen hat", ruf: "Markt", ties: "Halbritter oder Gilde", world: "Schild oder Leere", unlocks: "Reihe 2/3 bleiben unabhängig", faction: "Gilde" };
    q.lore = { places: "30, 84, 16", factions: "Gilde", people: "Halbritter, Reichart, Albrecht", events: "Finale Kontor", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Halbritter im Erker warnen.", "Er glaubt oder nicht. Glauben kostet ihn.", "sichtbar", "", false, "Ziel auf dem Rücken."),
      V("alternativ", "Bei Reichart Schweigen verkaufen.", "Teil. Schloss. Kein Schild mit eurem Namen.", "drin", "", false, "Fäulnis."),
      V("kreativ", "Schlüsselbund ohne Herren an 26 vorbei — Lager der Zunft.", "Stumm der Nachtwächter. Hintere Kammer bleibt zu.", "", "26", false, "Kein Keim ziehen."),
      V("chaotisch", "Schild selbst nageln.", "Bram Holt. Öffentlichkeit.", "laut", "", false, "Die Stadt muss antworten."),
      V("böse", "Halbritter den Gilden als Nächsten nennen.", "Er fehlt später. Ihr werdet bezahlt.", "Gilde warm", "", true, "Nächster Fremder."),
    ];
    q.actions = "Kein reines Ende.";
    q.nodes = {
      trigger: "30 (Keim still bis SL). Halbritter 84.",
      geber: "Halbritter. Überleben, nicht siegen.",
      aufgabe: "Wer steht in Nummer 10.",
      hinweise: "Schloss. Erker. Schlüsselbund.",
      konflikt: "Sichtbar werden oder Fäulnis teilen oder wegsehen.",
      entscheidung: "Halbritter / Schweigen / nichts.",
      konsequenz: "Markt dauerhaft. Morr schweigt.",
      belohnung: "Silber oder Feind. Keine Gerechtigkeit.",
      welt: "Schild oder Leere. Halbritter anders oder weg.",
      folge: "keine. Reihen 2 und 3 unabhängig, bis ihr das ändert.",
    };
  }),

  Q("q-2-1", "Wer zahlt, bleibt", ORDNUNG, "q-2-2", "", (q) => {
    q.type = "Gespräch";
    q.difficulty = "mittel";
    q.faction = "keine";
    q.region = "6-schatten";
    q.triggers = [
      { id: "q-2-1-t1", kind: "Gespräch", place: "98", npc: "wenzel-reifenberg", condition: "sie klopfen. Pia liegt innen.", chance: "immer", once: true },
      { id: "q-2-1-t2", kind: "Gerücht", place: "12", npc: "rudi-krell", condition: "Krell am Tor, nicht in der Bettelgasse", chance: "immer", once: false },
    ];
    q.giver = {
      npcId: "wenzel-reifenberg", name: "Wenzel Reifenberg", race: "Mensch", age: "37", role: "Tagelöhner",
      faction: "keine", alignment: "offen", status: "Messing",
      ties: "Ulla, Pia krank", enemies: "die Ordnung",
      secrets: "hat aufgehört zu zahlen, weil Brot und Krankheit nicht beides gehen",
      motive: "Pia durch den Winter", fear: "Ziege am Zaun, dann die Tür",
      goals: "dass jemand anderes zahlt oder dass es aufhört — beides unmöglich allein",
    };
    q.story = {
      believes: "Arme leihen sich untereinander. So ist die Gasse.",
      happened: "Schutzgeld. Wer zahlt, bleibt. Wer zweimal nicht zahlt, dessen Name wird nicht mehr gesagt.",
      twist: "Mitspielen hält Pia eine Woche. Offenlegen macht die ganze Gasse zum Exempel.",
      truth: "Beides blutet.",
    };
    q.goals = [{
      id: "q-2-1-g1", text: "Zahlen oder die Gasse hören lassen.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Sie gehen. In drei Nächten hängt etwas am Zaun.",
      success: "Geld liegt oder ein Mund am Brunnen. Beides hat Preis.",
      reward: "Zugang zum Hinterzimmer oder Feindschaft mit 62.",
    }];
    q.world = { npcs: "Ulla schließt die Tür gegen Fremde, oder gegen die Gasse.", dialogs: "Krell am Tor redet leiser.", places: "98: Tür vernagelt oder offen.", traders: "", enemies: "Krumm, wenn offengelegt", factions: "" };
    q.tree = [
      { id: "q-2-1-d1", label: "Selbst zahlen / mitspielen", outcome: "Pia isst. Ihr seid Zahler. q-2-2 als Gläubige.", children: [] },
      { id: "q-2-1-d2", label: "Offenlegen", outcome: "Gasse hört. Exempel droht. q-2-2 als Feinde.", children: [] },
      { id: "q-2-1-d3", label: "Wegsehen", outcome: "Nächste Woche fehlt ein Tier. q-2-3 kommt früher.", children: [] },
    ];
    q.rewards = { groschen: "zahlen: weg. offenlegen: keins", xp: "", items: "", ruf: "Gasse", ties: "Reifenberg", world: "Tür", unlocks: "q-2-2", faction: "" };
    q.lore = { places: "98, 12", factions: "Ordnung (kein Amt)", people: "Wenzel, Ulla, Pia, Rudi Krell", events: "Schutzgeld", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Klopfen, Brot hinlegen.", "Wenzel nimmt. Sagt nicht wofür.", "", "q-2-2", false, "Mitspielen ohne Wort."),
      V("alternativ", "Krell am Tor fragen.", "Rudi: nicht hier. Die Gasse.", "", "98", false, "Ort korrigiert."),
      V("kreativ", "Zaun ansehen, ohne zu reden.", "Nichts hängt. Noch nicht.", "", "", false, "Zeit."),
      V("chaotisch", "In der Gasse schreien, dass gezahlt wird.", "Fenster zu. Fips hört.", "laut", "62", false, "Ordnung weiß."),
      V("böse", "Wenzel der Ordnung nennen.", "Er zahlt mit Pia. Ihr seid satt.", "Gasse tot", "q-2-2", true, "Verrat, wie Laus."),
    ];
    q.actions = "Beides blutet.";
    q.nodes = {
      trigger: "98 Reifenberg. 12 Krell nur als zweites Exempel am Tor.",
      geber: "Wenzel. Pia.",
      aufgabe: "Zahlen oder hören lassen.",
      hinweise: "Krankes Kind. Kein zweites Geld. Nachbarn nagelten schon Türen.",
      konflikt: "Woche gegen Gasse.",
      entscheidung: "Zahlen / offenlegen / wegsehen.",
      konsequenz: "Zahler oder Feind oder Zaun.",
      belohnung: "Kein Lohn.",
      welt: "Tür vernagelt oder offen.",
      folge: "q-2-2 Hinterzimmer.",
    };
  }),

  Q("q-2-2", "Das Hinterzimmer", ORDNUNG, "q-2-3", "q-2-1", (q) => {
    q.type = "Erkunden";
    q.difficulty = "mittel";
    q.faction = "keine";
    q.region = "6-schatten";
    q.triggers = [
      { id: "q-2-2-t1", kind: "Gespräch", place: "57", npc: "janna-dunkelgrund", condition: "sie wollen hinter den Zapfhahn", chance: "immer", once: true },
      { id: "q-2-2-t2", kind: "Gespräch", place: "57", npc: "rolf-dunkelgrund", condition: "Alltag ist Bier. Druck ist das Hinterzimmer.", chance: "immer", once: false },
    ];
    q.giver = {
      npcId: "janna-dunkelgrund", name: "Janna Dunkelgrund", race: "Mensch", age: "38", role: "Hinterzimmer",
      faction: "keine", alignment: "offen", status: "Schenke",
      ties: "Rolf zapft; Nils oben", enemies: "wer ohne gefragt zu sein eintritt",
      secrets: "Ranald: X und Löcher, kein Priester, kein Apparat",
      motive: "das Zimmer bleibt unsichtbar", fear: "Sigmar hört, oder die Ordnung verliert den Tisch",
      goals: "sie als Zahler einlassen oder als Leichen hinaus",
    };
    q.story = {
      believes: "Eine schlechte Schenke. Wie jede.",
      happened: "Im Hinterzimmer wird ausgehandelt, wie viel Schmerz Ruhe kauft.",
      twist: "Einschleichen heißt zahlen und schweigen. Gewalt heißt Krieg mit 62 in ihrem Haus.",
      truth: "Kein Tempel. Ein Tisch. X an der Tür, wenn sie hinsehen.",
    };
    q.goals = [{
      id: "q-2-2-g1", text: "Hinter den Hahn, ohne dass Nils es unten erzählt.", kind: "Infiltrieren", required: true, progress: 0,
      fail: "Rolf kennt sie als Störer. Tür bleibt.",
      success: "Sie haben den Tisch gesehen. Namen der nächsten Zahlung.",
      reward: "q-2-3 liegt: wer als Nächstes.",
    }];
    q.world = { npcs: "Janna stellt Nils nach oben oder auf die Gasse.", dialogs: "Rolf zapft ohne Blick.", places: "57 Hintertür hat ein X oder nicht.", traders: "", enemies: "Ordnung, wenn Gewalt", factions: "" };
    q.tree = [
      { id: "q-2-2-d1", label: "Als Zahler / still", outcome: "Einlass. Tisch. q-2-3 mit Namen.", children: [] },
      { id: "q-2-2-d2", label: "Gewalt", outcome: "Feindschaft fest. Nils sieht Blut. q-2-3 als Jagd.", children: [] },
      { id: "q-2-2-d3", label: "X lesen und gehen", outcome: "Kein Einlass. Spur zu 6 oder 18, Spieler wählen.", children: [] },
    ];
    q.rewards = { groschen: "Einlass kostet", xp: "", items: "", ruf: "Stube", ties: "Janna", world: "X sichtbar oder nicht", unlocks: "q-2-3", faction: "" };
    q.lore = { places: "57, 97 Wohnung", factions: "kein Kultapparat", people: "Janna, Rolf, Nils", events: "Schmerz wird Preis", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Bier, dann nach hinten nicken.", "Rolf hört nicht. Janna schon.", "", "", false, "Alltag zuerst."),
      V("alternativ", "Als Zahler von 98 kommen.", "Tür einen Spalt.", "drin", "q-2-3", false, "Gekauft."),
      V("kreativ", "X an der Tür selbst lesen. Nicht fragen.", "Kein Priester erklärt es.", "", "6", false, "Skill: Spieler lesen."),
      V("chaotisch", "Tür treten.", "Rolf hat einen Knüppel. Kein Heldentum.", "laut", "62", true, "Krieg im Haus."),
      V("böse", "Nils als Geisel.", "Janna öffnet. Hasst. Ordnung kommt.", "tot hier", "q-2-3", true, "Kind."),
    ];
    q.actions = "Kein Ranald-Apparat. X und Löcher.";
    q.nodes = {
      trigger: "57 Janna, Rolf. Alltag Bier.",
      geber: "Janna hält das Zimmer.",
      aufgabe: "Hinter den Hahn.",
      hinweise: "X. Nils. Tisch ohne Heilige.",
      konflikt: "Zahlen oder brechen.",
      entscheidung: "Still / Gewalt / X und gehen.",
      konsequenz: "Namen der nächsten Zahlung oder Krieg.",
      belohnung: "Einlass kostet.",
      welt: "X oder Blut.",
      folge: "q-2-3 Wer als Nächstes.",
    };
  }),

  Q("q-2-3", "Wer verschwindet als Nächstes", ORDNUNG, "q-2-4", "q-2-2", (q) => {
    q.type = "Auftrag";
    q.difficulty = "hart";
    q.faction = "keine";
    q.region = "6-schatten";
    q.triggers = [
      { id: "q-2-3-t1", kind: "Ereignis", place: "98", npc: "wenzel-reifenberg", condition: "nach 2-1/2-2: Exempel ist angesagt", chance: "immer", once: true },
      { id: "q-2-3-t2", kind: "Gerücht", place: "62", npc: "krumm", condition: "Keim 2 still. Nur Munkeln, kein Kreis.", chance: "immer", once: false },
    ];
    q.giver = {
      npcId: "ulla-reifenberg", name: "Ulla Reifenberg", race: "Mensch", age: "34", role: "",
      faction: "keine", alignment: "offen", status: "Messing",
      ties: "Wenzel, Pia", enemies: "Ordnung",
      secrets: "weiß, dass Wenzel der Nächste ist, und hat niemanden",
      motive: "Pia nicht allein", fear: "vernagelte Tür",
      goals: "eingreifen lassen, ohne den Preis zu nennen",
    };
    q.story = {
      believes: "Ein Streit unter Armen. Morgen ist es vorbei.",
      happened: "Die Ordnung will ein Exempel, das die Gasse hört.",
      twist: "Eingreifen = Feindschaft mit 62. Wegsehen = die Familie zahlt den Preis.",
      truth: "Kein Schutz ohne Herren. Die Stadt schickt keine Wache in die Bettelgasse.",
    };
    q.goals = [{
      id: "q-2-3-g1", text: "Diese Nacht: stehen oder gehen.", kind: "Beschützen", required: true, progress: 0,
      fail: "Tür vernagelt. Name nicht mehr gesagt.",
      success: "Sie standen oder sie gingen. Die Gasse weiß es.",
      reward: "Feind oder Schuld.",
    }];
    q.world = { npcs: "Pia da oder nicht.", dialogs: "Nachbarn reden nicht mehr mit euch, oder nur mit euch.", places: "98 Tür.", traders: "", enemies: "Krumm/Fips/Auge wenn eingegriffen", factions: "" };
    q.tree = [
      { id: "q-2-3-d1", label: "Eingreifen", outcome: "Feindschaft. Familie lebt. q-2-4: Laus als Auge der Ordnung.", children: [] },
      { id: "q-2-3-d2", label: "Wegsehen", outcome: "Preis. q-2-4 trotzdem: Laus hat verkauft, wen es trifft.", children: [] },
      { id: "q-2-3-d3", label: "Für die Ordnung stehen", outcome: "Ihr seid das Exempel. Silber. Gasse tot für euch.", children: [] },
    ];
    q.rewards = { groschen: "nur wenn für die Ordnung", xp: "", items: "", ruf: "Gasse", ties: "Reifenberg oder Ordnung", world: "Tür", unlocks: "q-2-4", faction: "" };
    q.lore = { places: "98, 62", factions: "Ordnung", people: "Ulla, Wenzel, Pia, Krumm", events: "Exempel", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Die Nacht vor der Tür.", "Fips zuerst, nicht Krumm.", "Gasse sieht", "q-2-4", true, "Feindschaft."),
      V("alternativ", "Weg, vor Morgen.", "Zaun. Stille.", "Schuld", "q-2-4", false, "Preis."),
      V("kreativ", "Heinz Laub / Bram Holt holen — Wache kommt ungern.", "Eine Stunde, dann weg. Kein Kerker.", "", "Osttor", false, "Macht klein."),
      V("chaotisch", "Feuer in der Gasse als Ablenkung.", "Andere Türen. Andere Opfer.", "laut", "", false, "Nicht nur 98."),
      V("böse", "Mit der Ordnung die Tür.", "Silber. Name ungesagt.", "Gasse tot", "q-2-4", true, "Ihr seid das Exempel."),
    ];
    q.actions = "Wache kommt ungern. Kein Palast.";
    q.nodes = {
      trigger: "98 nach den ersten Teilen. 62 nur Munkeln, Keim still.",
      geber: "Ulla.",
      aufgabe: "Stehen oder gehen.",
      hinweise: "Exempel. Nachbarn nageln aus Höflichkeit.",
      konflikt: "Feindschaft gegen Preis.",
      entscheidung: "Eingreifen / wegsehen / für die Ordnung.",
      konsequenz: "Familie oder Silber.",
      belohnung: "Feind oder Schuld.",
      welt: "Tür. Pia da oder nicht.",
      folge: "q-2-4 Verrat unter Bettlern.",
    };
  }),

  Q("q-2-4", "Verrat unter Bettlern", ORDNUNG, "q-2-5", "q-2-3", (q) => {
    q.type = "Gespräch";
    q.difficulty = "mittel";
    q.faction = "keine";
    q.region = "1-vorstadt";
    q.triggers = [
      { id: "q-2-4-t1", kind: "Gespräch", place: "1", npc: "gerlach-wendisch", condition: "jemand beginnt. Alltag ist Almosen.", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "gerlach-wendisch", name: "Gerlach Wendisch", race: "Mensch", age: "30", role: "Bettler",
      faction: "keine", alignment: "offen", status: "Messing",
      ties: "verkauft an Krumm; zählt Wagen", enemies: "wer ihn bloßstellt",
      secrets: "hat einen Bettler verkauft, der ihm vertraute; aß danach satt. Zählt noch immer Wagen.",
      motive: "Silber, das er nicht braucht, in der Schüssel, damit niemand fragt",
      fear: "dass man ihn als Laus und als Zeuge zugleich braucht",
      goals: "Quelle bleiben. Nicht genannt werden.",
    };
    q.story = {
      believes: "Ein armer Mann vor der Mauer. Almosen.",
      happened: "Laus ist das billigste Auge der Ordnung. Er hat die Karren gezählt. Er verkauft noch.",
      twist: "Ihn nutzen heißt den Verrat füttern. Ihn bloßstellen heißt das Auge verlieren — und er verkauft euch als Nächstes, wenn er überlebt.",
      truth: "Sattwerden war der Verrat. Nicht die Not.",
    };
    q.goals = [{
      id: "q-2-4-g1", text: "Die Quelle behalten oder verbrennen.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Er schweigt und verkauft euch.",
      success: "Ohr bleibt oder ist tot.",
      reward: "Infos für 2-5 und/oder Kontor, oder nichts.",
    }];
    q.world = { npcs: "Laus sitzt noch oder nicht.", dialogs: "Krumm sucht ein neues Ohr.", places: "1: Schüssel leer oder voller ungeprägter Münze.", traders: "", enemies: "Laus wenn bloßgestellt und lebend", factions: "" };
    q.tree = [
      { id: "q-2-4-d1", label: "Weiter nutzen", outcome: "Ohr. Schuld. q-2-5 mit Innenwissen.", children: [] },
      { id: "q-2-4-d2", label: "Bloßstellen", outcome: "Quelle weg. Ordnung blind für eine Woche. Laus hasst oder fehlt.", children: [] },
      { id: "q-2-4-d3", label: "Silber für beide Seiten", outcome: "Kurzes Spiel. Beide erfahren es.", children: [] },
    ];
    q.rewards = { groschen: "er nimmt immer", xp: "", items: "ungeprägte Münze in der Schüssel", ruf: "Vorstadt", ties: "Laus oder tot", world: "Schüssel", unlocks: "q-2-5; Kontor-Zeuge bleibt Schirm bis Reihe 1 ihn braucht", faction: "" };
    q.lore = { places: "1, 62", factions: "Ordnung", people: "Gerlach Wendisch, Krumm", events: "alter Verrat, Wagen zählen", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Brot in die Schüssel.", "Name. Warnung vor dem Zoll. Nicht mehr.", "", "", false, "Alltag."),
      V("alternativ", "Nach der Ordnung fragen.", "Er will eine zweite Zahlung.", "gekauft", "q-2-5", false, "Ohr."),
      V("kreativ", "Ungeprägte Münze behalten.", "Jemand anderes fragt, nicht Laus.", "", "62", false, "Heft-Gerücht."),
      V("chaotisch", "Ihn an den Zoll schleifen.", "Falk will Mutation und Waffen, keine Gasse.", "", "7", false, "Amt hört nicht."),
      V("böse", "Ihn der Ordnung als undicht nennen.", "Er fehlt. Schüssel leer.", "Auge tot", "q-2-5", true, "Wie er einst tat."),
    ];
    q.actions = "Kein pfiffiger Bettler.";
    q.nodes = {
      trigger: "1. Gespräch beginnt.",
      geber: "Laus. Sattwerden war der Verrat.",
      aufgabe: "Quelle behalten oder verbrennen.",
      hinweise: "Münze ohne Gepräge. Wagen. Krumm kauft Ohren.",
      konflikt: "Ohr gegen Schuld.",
      entscheidung: "Nutzen / bloßstellen / beiden.",
      konsequenz: "Infos oder Feind.",
      belohnung: "Münze. Kein Held.",
      welt: "Schüssel. Krumm sucht ein Auge.",
      folge: "q-2-5 Zerschlagen oder übernehmen.",
    };
  }),

  Q("q-2-5", "Zerschlagen oder übernehmen", ORDNUNG, "", "q-2-4", (q) => {
    q.type = "Politisch";
    q.difficulty = "hart";
    q.priority = "hoch";
    q.faction = "keine";
    q.region = "6-schatten";
    q.triggers = [
      { id: "q-2-5-t1", kind: "Gespräch", place: "62", npc: "krumm", condition: "Keim 2 nur ziehen wenn SL will. Sonst Clique ohne Kreis.", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "krumm", name: "Krumm", race: "Mensch", age: "42", role: "Ordnung",
      faction: "keine", alignment: "offen", status: "Messing",
      ties: "Fips, Auge; kauft Laus", enemies: "wer die Gasse ohne Herren lassen will",
      secrets: "Geburtsname unbekannt",
      motive: "Ordnung ist Gnade, sagt er", fear: "Leere Gasse, in der jeder schlägt",
      goals: "bleiben oder sterben als Herren",
    };
    q.story = {
      believes: "Eine Bande zerschlagen ist gut. Die Armen sind frei.",
      happened: "Die Ordnung ist der einzige Schutz, den die Gasse je hatte — und ihr Erpresser.",
      twist: "Auflösen macht Arme schutzlos gegen den nächsten Fips. Übernehmen heißt: ihr seid die Ordnung.",
      truth: "Kein sauberes Ende.",
    };
    q.goals = [{
      id: "q-2-5-g1", text: "Herren weg oder Herren neu.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Clique bleibt. Ihr seid das nächste Exempel.",
      success: "Gasse ohne sie, oder mit euch.",
      reward: "Angst oder Kommando. Beides schmutzig.",
    }];
    q.world = { npcs: "Krumm da oder nicht. Fips vielleicht allein.", dialogs: "Reifenberg zahlt an wen jetzt.", places: "62 leer oder euer Tisch.", traders: "", enemies: "der Rest der Clique", factions: "" };
    q.tree = [
      { id: "q-2-5-d1", label: "Auflösen", outcome: "Schutz weg. Nächste Faust kommt in einem Monat, ohne Namen.", children: [] },
      { id: "q-2-5-d2", label: "Übernehmen", outcome: "Ihr kassiert. Die Gasse hasst leiser.", children: [] },
      { id: "q-2-5-d3", label: "Krumm stehen lassen, Fips opfern", outcome: "Ordnung kleiner. Erpressbarer. Lebt weiter.", children: [] },
    ];
    q.rewards = { groschen: "übernehmen: ja, blutig", xp: "", items: "", ruf: "Gasse", ties: "Ordnung oder tot", world: "62", unlocks: "unabhängig von Reihe 1 und 3", faction: "" };
    q.lore = { places: "62", factions: "Ordnung", people: "Krumm, Fips, Auge", events: "Finale Gasse", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Mit Krumm reden, als Zahler.", "Er bietet Teilhabe.", "drin", "", false, "Übernehmen ohne Schwert."),
      V("alternativ", "Gasse gegen sie hetzen.", "Eine Nacht. Dann neue Faust.", "laut", "", true, "Auflösen, nicht heilen."),
      V("kreativ", "Auge allein kaufen.", "Ein Name gegen den anderen.", "", "", false, "Spalten."),
      V("chaotisch", "Feuerkreis ohne SL-Keim — falsch.", "SL: Keim bleibt still. Nur Hütte, kein Ritual.", "", "", false, "Quest zieht den Keim nicht."),
      V("böse", "Die Gasse als euer Exempel.", "Ihr seid Krumm.", "Herren", "", true, "Übernehmen."),
    ];
    q.actions = "Keim 2 nicht durch die Quest ziehen.";
    q.nodes = {
      trigger: "62. Keim still bis SL.",
      geber: "Krumm.",
      aufgabe: "Herren weg oder neu.",
      hinweise: "Schutz und Erpressung sind dasselbe Amt.",
      konflikt: "Schutzlos gegen Herren.",
      entscheidung: "Auflösen / übernehmen / spalten.",
      konsequenz: "Nächste Faust oder ihr.",
      belohnung: "Angst oder Groschen.",
      welt: "62 leer oder euer Tisch.",
      folge: "keine. Reihen unabhängig.",
    };
  }),

  Q("q-3-1", "Was unter Rattenwinkel liegt", RATTEN, "q-3-2", "", (q) => {
    q.type = "Erkunden";
    q.difficulty = "hart";
    q.faction = "keine";
    q.region = "6-schatten";
    q.triggers = [
      { id: "q-3-1-t1", kind: "Gebiet betreten", place: "69", npc: "", condition: "Keim 1 still. Nachbarn meiden. Nicht betreten lassen ohne Preis — SL entscheidet, ob sie sterben oder nur riechen.", chance: "immer", once: false },
      { id: "q-3-1-t2", kind: "Gespräch", place: "55", npc: "silas-wehming", condition: "sie Hilfe bei Morr suchen", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "silas-wehming", name: "Silas Wehming", race: "Mensch", age: "46", role: "Totengräber",
      faction: "Morr", alignment: "offen", status: "Messing",
      ties: "Odila; Miren Amsel", enemies: "wer Untotes leugnet, indem er hineingeht als Spaß",
      secrets: "weiß, dass unter der Stadt etwas nicht mehr still liegt — nicht wann es begann",
      motive: "Tote bleiben tot", fear: "Garten reicht nicht",
      goals: "allein gehen lassen oder mit Spaten dabei sein",
    };
    q.story = {
      believes: "Leerstand. Ratten. Aberglaube der Armen.",
      happened: "Das Haus lebt weiter. Geruch süß unter der Verwesung. Zwei, die hineingingen, kamen nicht zurück.",
      twist: "Allein gehen ist Dummheit, die die Stadt nicht begräbt. Hilfe holen macht Morr zur Zeugin — und die Stadt muss hören.",
      truth: "Noch nicht was darunter ist. Nur: sie haben den Preis gesehen oder gerochen.",
    };
    q.goals = [{
      id: "q-3-1-g1", text: "An der Schwelle bleiben oder sie überschreiten.", kind: "Erkunden", required: true, progress: 0,
      fail: "Sie gehen nie hin. Keim bleibt Gerücht.",
      success: "Allein oder mit Wehming/Amsel. Etwas bleibt an den Zähnen.",
      reward: "q-3-2 liegt.",
    }];
    q.world = { npcs: "Nachbarn reden nicht. Oder sie nageln 69.", dialogs: "Miren länger am Garten.", places: "69 unverändert, bis SL den Keim zieht.", traders: "", enemies: "", factions: "Morr merkt" };
    q.tree = [
      { id: "q-3-1-d1", label: "Allein hinein", outcome: "SL setzt den Preis. Keim nicht automatisch. q-3-2 mit Angst, ohne Zeugen.", children: [] },
      { id: "q-3-1-d2", label: "Wehming / Amsel", outcome: "Zeugen. Stadt hört Gerücht von Morr, nicht von euch.", children: [] },
      { id: "q-3-1-d3", label: "Nur riechen, gehen", outcome: "Leben. q-3-2 trotzdem über Stolzenau.", children: [] },
    ];
    q.rewards = { groschen: "nein", xp: "", items: "", ruf: "Schatten", ties: "Wehming", world: "Geruch", unlocks: "q-3-2", faction: "Morr" };
    q.lore = { places: "69, 55, 56", factions: "Morr", people: "Silas, Odila, Miren", events: "zwei kamen nicht zurück", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Vor der Tür stehen.", "Geruch. Kratzen zu schwer für Ratten.", "", "", false, "Schwelle."),
      V("alternativ", "Silas holen.", "Spaten. Kein Segen als Schild.", "Morr", "q-3-2", false, "Zeuge."),
      V("kreativ", "Nachbarn fragen, ohne 69 zu nennen.", "Sie meiden den Blick.", "", "68", false, "Stolzenau."),
      V("chaotisch", "Mit Fackel und Lärm.", "Fenster zu. Etwas antwortet oder nicht — SL.", "laut", "", false, "Keim still."),
      V("böse", "Jemanden hineinschicken, der nicht zurück soll.", "Die Stadt hat das schon getan.", "schuld", "q-3-2", true, "Wie die zwei."),
    ];
    q.actions = "Quest zieht Keim 1 nicht.";
    q.nodes = {
      trigger: "69 still. 55 Silas.",
      geber: "Silas, wenn sie Hilfe holen. Sonst die Schwelle.",
      aufgabe: "Schwelle.",
      hinweise: "Süß unter Verwesung. Zwei fehlen.",
      konflikt: "Allein gegen Zeugen gegen gehen.",
      entscheidung: "Allein / Morr / riechen.",
      konsequenz: "Angst oder Gerücht von Morr.",
      belohnung: "Kein Silber.",
      welt: "69 unverändert bis SL.",
      folge: "q-3-2 Stolzenau.",
    };
  }),

  Q("q-3-2", "Die Familie, die verschwand", RATTEN, "q-3-3", "q-3-1", (q) => {
    q.type = "Mordfall";
    q.difficulty = "mittel";
    q.faction = "keine";
    q.region = "6-schatten";
    q.triggers = [
      { id: "q-3-2-t1", kind: "Gebiet betreten", place: "68", npc: "", condition: "Haus leer seit 2506", chance: "immer", once: false },
      { id: "q-3-2-t2", kind: "Gespräch", place: "21", npc: "helmuth-kirchweger", condition: "sie wollen die Stadtversion", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "helmuth-kirchweger", name: "Helmuth Kirchweger", race: "Mensch", age: "46", role: "Mann im Ratshaus",
      faction: "Silber", alignment: "offen", status: "Silber",
      ties: "Johann führt Listen", enemies: "wer 2506 aufgräbt",
      secrets: "fortgezogen steht in keiner echten Liste",
      motive: "alte Löcher zu lassen", fear: "dass 69 und 68 dieselbe Nacht sind",
      goals: "Stadtversion verkaufen",
    };
    q.story = {
      believes: "Abel und Mira Stolzenau sind 2506 fortgezogen.",
      happened: "Spurlos. Das Haus steht. Die Stadt sagt fort.",
      twist: "Der offiziellen Version glauben schließt 69. Eigenen Spuren folgen öffnet 6 und 1.",
      truth: "Fortgezogen ist das Wort für unbegraben.",
    };
    q.goals = [{
      id: "q-3-2-g1", text: "Fortgezogen oder nicht.", kind: "Erkunden", required: true, progress: 0,
      fail: "Liste reicht ihnen. q-3-3 bleibt Gerücht.",
      success: "Stadtversion oder Spur.",
      reward: "q-3-3 oder Ende der Neugier.",
    }];
    q.world = { npcs: "Johann streicht oder unterstreicht Stolzenau.", dialogs: "Miren kennt keine Gräber für 2506 mit dem Namen.", places: "68 bleibt leer.", traders: "", enemies: "", factions: "Rat will Ruhe" };
    q.tree = [
      { id: "q-3-2-d1", label: "Stadtversion", outcome: "Ruhe. 69 bleibt Aberglaube. Reihe 3 dünn.", children: [] },
      { id: "q-3-2-d2", label: "Eigenen Spuren", outcome: "q-3-3 Zeichen. Laus hat eine Karre gesehen — Schirm, nicht Pflicht.", children: [] },
      { id: "q-3-2-d3", label: "Gräber erzwingen", outcome: "Garten. Keine Steine. Morr wird unruhig.", children: [] },
    ];
    q.rewards = { groschen: "nein", xp: "", items: "", ruf: "Rat oder Schatten", ties: "Kirchweger oder Miren", world: "68", unlocks: "q-3-3", faction: "" };
    q.lore = { places: "68, 21, 56 Garten", factions: "Rat, Morr", people: "Abel, Mira (weg), Kirchweger, Miren", events: "2506 verschwunden", when: "2512 IZ, sechs Jahre danach" };
    q.variants = [
      V("wahrscheinlich", "Im Rat nach dem Namen fragen.", "Fortgezogen. Nächster.", "Ruhe", "", false, "Stadtversion."),
      V("alternativ", "68 durchsuchen.", "Staub. Kein Wagen. Eine Schüssel wie vor der Mauer.", "", "1", false, "Spur Laus, nicht Pflicht."),
      V("kreativ", "Miren nach 2506 ohne den Namen.", "Zu viele Tote. Keine Steine für die.", "", "56", false, "Garten."),
      V("chaotisch", "Haus 68 als Wohnung nehmen.", "Nachbarn fliehen. 69 näher.", "laut", "69", false, "Wohnen im Loch."),
      V("böse", "Die Stadtversion laut als Lüge am Brunnen.", "Rat muss antworten. Wache klein.", "feind", "q-3-3", false, "Öffentlich."),
    ];
    q.actions = "Kein Palastgericht.";
    q.nodes = {
      trigger: "68 leer. 21 Stadtversion.",
      geber: "Kirchweger verkauft fortgezogen.",
      aufgabe: "Fortgezogen oder nicht.",
      hinweise: "Keine Gräber. Schüssel. Sechs Jahre.",
      konflikt: "Liste gegen Loch.",
      entscheidung: "Stadt / Spur / Gräber.",
      konsequenz: "Ruhe oder q-3-3.",
      belohnung: "Kein Silber.",
      welt: "68 leer.",
      folge: "q-3-3 Zeichen am Vorstadtring.",
    };
  }),

  Q("q-3-3", "Das Zeichen am Vorstadtring", RATTEN, "q-3-4", "q-3-2", (q) => {
    q.type = "Gespräch";
    q.difficulty = "mittel";
    q.faction = "keine";
    q.region = "1-vorstadt";
    q.triggers = [
      { id: "q-3-3-t1", kind: "Gebiet betreten", place: "6", npc: "", condition: "Spieler das X selbst lesen lassen", chance: "immer", once: false },
      { id: "q-3-3-t2", kind: "Gespräch", place: "18", npc: "brant-amsberg", condition: "sie wollen Sigmar das Zeichen bringen", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "brant-amsberg", name: "Brant Amsberg", race: "Mensch", age: "53", role: "Priester Sigmar",
      faction: "Sigmar", alignment: "offen", status: "Silber",
      ties: "Jost", enemies: "was ohne Hammer auskommt",
      secrets: "Tempel klein, Macht dünn. Ein Zeichen am Ring ist Politik, nicht Theologie.",
      motive: "Stadtpatron sichtbar halten", fear: "dass der Ring ohne ihn glaubt",
      goals: "Melden = er besitzt das Problem. Decken = das Problem bleibt klein.",
    };
    q.story = {
      believes: "Ein verwittertes Zeichen. Kinder. Aberglaube.",
      happened: "X und Löcher. Informell. Kein Priester, keine Ordnung.",
      twist: "Decken/nutzen hält es klein und gefährlich. Melden an Amsberg macht es öffentlich und zu seiner Keule.",
      truth: "Kein Heil. Politik.",
    };
    q.goals = [{
      id: "q-3-3-g1", text: "Das X lesen. Dann halten oder tragen.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Sie sehen es nicht. q-3-4 wird falsche Fährte ohne Grund.",
      success: "Decken oder Melden.",
      reward: "Hebel bei Amsberg oder Stille am Ring.",
    }];
    q.world = { npcs: "Jost putzt den Pfahl oder lässt ihn.", dialogs: "Amsberg predigt gegen Aberglauben, wenn gemeldet.", places: "6: Zeichen frisch oder überstrichen.", traders: "", enemies: "", factions: "Sigmar sichtbar oder nicht" };
    q.tree = [
      { id: "q-3-3-d1", label: "Decken / nutzen", outcome: "Klein. q-3-4 ohne Tempeldruck.", children: [] },
      { id: "q-3-3-d2", label: "Amsberg", outcome: "Öffentlich. Sigmar will Namen. Wolfram gerät ins Gerede — q-3-4 schärfer.", children: [] },
      { id: "q-3-3-d3", label: "Pfahl umhauen", outcome: "Leere. Etwas sucht ein neues Holz.", children: [] },
    ];
    q.rewards = { groschen: "nein", xp: "", items: "", ruf: "Vorstadt oder Tempel", ties: "Amsberg", world: "6", unlocks: "q-3-4", faction: "Sigmar oder keine" };
    q.lore = { places: "6, 18", factions: "Sigmar, Ranald nur als Zeichen", people: "Brant, Jost", events: "X und Löcher", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Hinsehen. Nicht fragen.", "X. Löcher. Kein Katzenstandbild.", "", "", false, "Spieler lesen."),
      V("alternativ", "Amsberg das Holz beschreiben, nicht deuten.", "Er deutet trotzdem Hammer.", "Tempel", "q-3-4", false, "Politik."),
      V("kreativ", "Mit 57 vergleichen, ohne Kultwort.", "Janna: nicht hier.", "", "57", false, "Kein Apparat."),
      V("chaotisch", "Pfahl umhauen.", "Kinder. Dann ein anderes Holz.", "laut", "", false, "Leere."),
      V("böse", "Jost nachts an den Pfahl stellen.", "Brant zahlt in Predigt.", "Tempel feind", "q-3-4", true, "Novize."),
    ];
    q.actions = "Kein Kultapparat.";
    q.nodes = {
      trigger: "6. Spieler lesen. 18 nur wenn sie tragen.",
      geber: "Amsberg nur als Meldeadresse. Das Zeichen gibt sich selbst.",
      aufgabe: "Halten oder tragen.",
      hinweise: "X. Löcher. Tempel klein.",
      konflikt: "Klein und gefährlich gegen öffentlich und Keule.",
      entscheidung: "Decken / Amsberg / umhauen.",
      konsequenz: "Stille oder Predigt.",
      belohnung: "Hebel oder nichts.",
      welt: "Frisch oder überstrichen.",
      folge: "q-3-4 Ulric ohne Tempel.",
    };
  }),

  Q("q-3-4", "Ulric ohne Tempel", RATTEN, "q-3-5", "q-3-3", (q) => {
    q.type = "Gespräch";
    q.difficulty = "mittel";
    q.faction = "keine";
    q.region = "4a-schmiede";
    q.triggers = [
      { id: "q-3-4-t1", kind: "Gespräch", place: "90", npc: "wulf-wolfram", condition: "sie reden in der Esse-Pause, nicht in der Messe", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "wulf-wolfram", name: "Wulf Wolfram", race: "Mensch", age: "32", role: "Schmiedegeselle",
      faction: "keine", alignment: "offen", status: "Messing",
      ties: "Mark, nicht verwandt; 105 Nebenhaus", enemies: "Verdacht, der an der Esse klebt",
      secrets: "Ulric privat, weil die Stadt keinen Ort für Kälte und Ehrlichkeit hat",
      motive: "in Ruhe schmieden", fear: "als Kult gelten, wo nur ein Wolf ohne Haus ist",
      goals: "dass man loslässt",
    };
    q.story = {
      believes: "Die Schmiede weiß etwas Dunkles. Gesellen mit geheimen Göttern.",
      happened: "Private Verehrung. Kein Tempel. Falsche Fährte zu 69.",
      twist: "Loslassen ist die richtige Tat und fühlt sich wie Versagen an. Weitertreiben macht Unschuldige kaputt.",
      truth: "Drosselau hat keinen Ort für das Offene. Deshalb sieht jede Esse aus wie Schuld.",
    };
    q.goals = [{
      id: "q-3-4-g1", text: "Die Fährte liegen lassen.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Verdacht bleibt. 105 leidet. q-3-5 mit falschem Sündenbock.",
      success: "Loslassen — oder sie treiben weiter und die Quest merkt es als Schaden.",
      reward: "Klarheit oder Blut an der falschen Tür.",
    }];
    q.world = { npcs: "Mark redet nicht mehr mit Fremden, oder dankt knapp.", dialogs: "Bodo Vollrath schickt sie fort, wenn Verdacht laut wird.", places: "90. 105 schließt.", traders: "", enemies: "Schmiede, wenn weitergetrieben", factions: "" };
    q.tree = [
      { id: "q-3-4-d1", label: "Loslassen", outcome: "Richtige Tat. q-3-5 ohne Sündenbock.", children: [] },
      { id: "q-3-4-d2", label: "Weitertreiben", outcome: "Unschuldige. 105. Amsberg hört. 69 bleibt.", children: [] },
      { id: "q-3-4-d3", label: "Bei Vollrath verleumden", outcome: "Arbeit weg. Gesellen hassen. Fährte tot, Schaden da.", children: [] },
    ];
    q.rewards = { groschen: "nein", xp: "", items: "", ruf: "Schmiede", ties: "Wolfram oder tot", world: "105", unlocks: "q-3-5", faction: "" };
    q.lore = { places: "90, 105, 31", factions: "kein Ulric-Tempel", people: "Wulf, Mark, Gesellenfrau", events: "falsche Fährte", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Nach dem Gott fragen.", "Wulf: Kälte. Kein Haus.", "", "", false, "Privat."),
      V("alternativ", "Loslassen, zur 69 zurück.", "Mark nickt einmal.", "klar", "q-3-5", false, "Richtige Tat."),
      V("kreativ", "105 ansehen, nicht anklagen.", "Kind. Kohlbeet. Kein Kult.", "", "105", false, "Nebenhaus."),
      V("chaotisch", "Esse löschen als Beweis.", "Bodo. Arbeit tot.", "laut", "", false, "Schaden."),
      V("böse", "Amsberg die Gesellen nennen.", "Predigt. Unschuldige.", "Tempel", "q-3-5", false, "Sündenbock."),
    ];
    q.actions = "Weitertreiben ist der Fehler.";
    q.nodes = {
      trigger: "90 Wulf. Mark.",
      geber: "Wulf will Ruhe.",
      aufgabe: "Fährte liegen lassen.",
      hinweise: "Kein Tempel. Nebenhaus. Esse ist Arbeit.",
      konflikt: "Versagen-Gefühl gegen Schaden.",
      entscheidung: "Loslassen / weitertreiben / verleumden.",
      konsequenz: "Klarheit oder kaputte Unschuldige.",
      belohnung: "Kein Silber.",
      welt: "105 schließt oder nicht.",
      folge: "q-3-5 Was wirklich darunter liegt.",
    };
  }),

  Q("q-3-5", "Was wirklich darunter liegt", RATTEN, "", "q-3-4", (q) => {
    q.type = "Erkunden";
    q.difficulty = "hart";
    q.priority = "hoch";
    q.faction = "keine";
    q.region = "6-schatten";
    q.triggers = [
      { id: "q-3-5-t1", kind: "Gebiet betreten", place: "69", npc: "", condition: "SL zieht Keim 1 jetzt oder verweigert. Quest zieht nicht.", chance: "immer", once: true },
    ];
    q.giver = {
      npcId: "miren-amsel", name: "Miren Amsel", race: "Mensch", age: "52", role: "Priesterin Morr",
      faction: "Morr", alignment: "offen", status: "Silber",
      ties: "Silas, Nebenhaus 104", enemies: "was nicht tot bleibt",
      secrets: "Ritus gegen Untotes war Setzung. Reicht nicht mehr.",
      motive: "die Stadt nicht fressen lassen", fear: "Garten und Osttor reichen nicht",
      goals: "eine Entscheidung, die ganz Drosselau trifft — ohne Heil",
    };
    q.story = {
      believes: "Ein letztes leeres Haus. Ende der Neugier.",
      happened: "Was darunter liegt, ist das, was übrigblieb, als die Stadt wegsah — Kontor-Nacht und Gasse eingeschlossen, wenn ihr das so gelegt habt. Sonst nur 69.",
      twist: "Konsequenz trifft die Stadt, nicht den Helden. Reihen 1 und 2 nur verknüpfen, wenn deren Welt schon geändert ist. Sonst unabhängig.",
      truth: "Kein Sieg. Eindämmen, füttern, oder die Stadt so lassen, bis es durch die Keller kommt.",
    };
    q.goals = [{
      id: "q-3-5-g1", text: "Was die Stadt damit tut.", kind: "Entscheiden", required: true, progress: 0,
      fail: "Keim bleibt still für immer. Es atmet weiter.",
      success: "Eindämmen, öffnen, oder opfern. Stadt merkt es am Geruch.",
      reward: "Welt. Keine Gerechtigkeit.",
    }];
    q.world = { npcs: "Miren älter. Silas gräbt flacher.", dialogs: "Osttor: Heinz Laub noch ungern.", places: "69 Narbe oder offen oder versiegelt.", traders: "", enemies: "was darunter, wenn geöffnet", factions: "Morr, und nur dann Gilde/Ordnung wenn deren Finale lag." };
    q.tree = [
      { id: "q-3-5-d1", label: "Versiegeln / eindämmen", outcome: "Geruch bleibt. Stadt lebt. Es wartet.", children: [] },
      { id: "q-3-5-d2", label: "Öffnen / hinab", outcome: "Preis. SL setzt, was unten ist. Kein Katalogname dafür erfinden, bis ihr ihn setzt.", children: [] },
      { id: "q-3-5-d3", label: "Stadt weiter wegsehen lassen", outcome: "Wie 2506. Wie das Kontor. Wie die Gasse.", children: [] },
    ];
    q.rewards = { groschen: "nein", xp: "", items: "", ruf: "Stadt", ties: "Morr", world: "69 Narbe", unlocks: "nur wenn Reihe 1/2 schon Weltflags haben — sonst nichts", faction: "Morr" };
    q.lore = { places: "69, 56, Osttor", factions: "Morr", people: "Miren, Silas", events: "Finale Rattenwinkel", when: "2512 IZ" };
    q.variants = [
      V("wahrscheinlich", "Miren an die Schwelle.", "Ritus. Reicht nicht. Sie sagt das.", "Morr", "", false, "Setzung bricht."),
      V("alternativ", "Versiegeln mit Kalk und Nagel.", "Nachbarn helfen, ohne zu fragen.", "Narbe", "", false, "Wartet."),
      V("kreativ", "Laus fragen, wann es zu atmen begann — nur wenn 2-4 ihn gelassen hat.", "Eine Karre unter Planen. Schirm.", "", "1", false, "Kein Zwang zur Verknüpfung."),
      V("chaotisch", "Stadt am Brunnen zusammenrufen.", "Rat und Gilde müssen wegsehen öffentlich.", "laut", "", false, "Wie immer."),
      V("böse", "Jemanden hinunterschicken.", "Die zwei von damals. Wieder.", "schuld", "", true, "Füttern."),
    ];
    q.actions = "Nichts darunter benennen, das nicht im Heft steht — SL setzt oder lässt leer.";
    q.nodes = {
      trigger: "69. SL zieht Keim oder nicht. Quest nicht.",
      geber: "Miren, wenn sie Morr holen. Sonst die Schwelle.",
      aufgabe: "Was die Stadt damit tut.",
      hinweise: "Setzung reicht nicht. Zwei fehlen. Süß.",
      konflikt: "Eindämmen, öffnen, wegsehen.",
      entscheidung: "Narbe / hinab / 2506 wiederholen.",
      konsequenz: "Stadt, nicht Held.",
      belohnung: "Kein Silber. Kein Heil.",
      welt: "Narbe, offen, oder wie zuvor.",
      folge: "keine. Verknüpfung nur wenn 1 und 2 schon Welt geändert haben.",
    };
  }),
];

export const QUEST_TALKS: Record<string, string> = {
  "30": `Trigger: Jemand geht hinein oder redet am Tor.

Alltag: Zwei Tore. Staub in Linien, als hätte jemand gefegt, nicht gehaust. Kein Schild.

Druck: Die Krämer sagen, das Haus stiehlt ihnen Kunden. Die Gilde sagt, der Reik hat die Fremden geholt.

Spur: Wer Maß sucht, geht zur Waage. Wer Namen sucht, zum Sitz Marktplatz 1.`,
  "88": `Trigger: Kauf oder Frage nach Nummer 10.

Alltag: Kleines Zeug. Schuldbuch, keine Preise.

Druck: Nummer 10 bleibt leer und verdient trotzdem. Reichart lächelt.

Spur: Sitz 16. Oder das leere Haus selbst.`,
  "16": `Trigger: Sie reden am Sitz, nicht in der Wohnung.

Alltag: Namen, Preise, wer liefern darf.

Druck: Leer ist leer. Der Reik hat sie geholt.

Spur: Wer Papier will, geht zu Dorn. Wer zweifelt, zum Erker Halbritter.`,
  "19": `Trigger: Streit ums Maß.

Alltag: Emil Kant wiegt. Betrug ist Alltag.

Druck: Manche Säcke kommen ohne Haus.

Spur: 88 Pergel. 30 wenn sie die Leere meinen.`,
  "20": `Trigger: Einsicht oder Tinte.

Alltag: Siegel. Agnes kopiert.

Druck: Manche Nächte stehen nicht im Kirchenbuch.

Spur: Bruder am Tor, Haus 75. Oder das Datum gegen 18 halten, ohne es zu nennen.`,
  "75": `Trigger: Kauf oder Bücher.

Alltag: Ware. Cyprian schreibt.

Druck: Kundenlisten mit durchgestrichenen Händen.

Spur: Bruder siegelt in 20. Halbritter sieht den Erker.`,
  "21": `Trigger: Audienz, nicht Amt.

Alltag: Johann nimmt Namen. Warten.

Druck: Das Haus lebt, wie alle, von dem was der Platz hergibt.

Spur: Sitz 16. Marsold 23, wenn sie Schulden meinen.`,
  "84": `Trigger: Gespräch am Erker.

Alltag: Kauf. Zwei Türen: Ware links, Leute rechts — das ist 22, hier ist Blick.

Druck: Wer neben einem leeren Kontor handelt, zählt Karren.

Spur: 30. Oder schweigen und bleiben.`,
  "98": `Trigger: Klopfen.

Alltag: Wenig. Kind hustet innen.

Druck: Wer zweimal nicht zahlt, dessen Name wird nicht mehr gesagt.

Spur: Die Stube, wenn sie den Hahn meinen. Torstraße 6 nur als zweites Haus, nicht als diese Gasse.`,
  "12": `Trigger: Gespräch am Tor, nicht in der Bettelgasse.

Alltag: Tagelohn. Ziege.

Druck: Hier ist es ländlich. Die Gasse ist woanders.

Spur: Reifenberg 98.`,
  "57": `Trigger: Bier.

Alltag: Rolf zapft. Nicht Zum Wanderer.

Druck: Hinter dem Hahn wird ausgehandelt, wie viel Schmerz Ruhe kauft.

Spur: Janna. Oder X selbst lesen, Haus 6.`,
  "1": `Trigger: Almosen oder Ansprache.

Alltag: Schüssel. Wagen zählen. Laus hört.

Druck: Nachts liegt eine Münze ohne Gepräge.

Spur: Wer Ohren kauft, sitzt nicht hier. Bettelgasse 3. Wer Nächte zählt, bleibt.`,
  "62": `Trigger: Jemand redet. Keim still.

Alltag: Hütte. Clique. Kein Kreis, bis der SL zieht.

Druck: Wer zahlt, bleibt.

Spur: Reifenberg. Laus. Hinterzimmer.`,
  "69": `Trigger: Vor der Tür stehen. Keim still.

Alltag: Nachbarn meiden den Blick. Geruch.

Druck: Süß unter der Verwesung. Zwei kamen nicht zurück.

Spur: Das leere Haus daneben, 68. Oder Morr, Spaten, nicht Segen.`,
  "68": `Trigger: Eintreten in Leere.

Alltag: Staub. Seit 2506 niemand.

Druck: Die Stadt sagt fortgezogen.

Spur: Ratshaus für die Liste. Garten für fehlende Steine.`,
  "6": `Trigger: Hinsehen.

Alltag: Pfahl. Kein Standbild.

Druck: X und Löcher. Kein Priester erklärt es.

Spur: Wer es tragen will, 18. Wer vergleichen will, Hinterzimmer — ohne Kultwort.`,
  "90": `Trigger: Pause an der Esse.

Alltag: Gesellen. Nicht verwandt. Arbeit.

Druck: Die Stadt hat keinen Ort für Kälte.

Spur: Loslassen. 69 bleibt. 105 nicht anklagen.`,
  "55": `Trigger: Dienst, nicht Amt.

Alltag: Spaten. Odila wäscht.

Druck: Manche Toten haben keine Steine.

Spur: 69 nur mit Preis. 56 Ritus.`,
};
