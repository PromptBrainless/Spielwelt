---
name: drosselau-quest
description: >
  Design and run Drosselau table quests as a node checklist, not as an in-app
  quest database. Use when writing or reviewing an Auftrag, Quest, Trigger,
  Questgeber, Plot Twist, Entscheidungsbaum, Belohnung, Weltzustand, or
  Spielleiter-Modul. Do not load a /quest UI or seed a plot unless the user
  explicitly asks to implement it in the catalog. Triggers on "Quest",
  "Auftrag", "Questgeber", "Trigger", "SL-Modul", "Entscheidungsbaum",
  "Plot Twist", "Folgequest", "was muss ich sagen".
metadata:
  short-description: "Drosselau-Quest: Knoten, tun oder sagen, Heft treu, nicht ins Projekt laden"
user-invocable: true
---

# Drosselau · Quest (tun oder sagen)

Das ist **kein Code**. Keine Route, keine Datenbank, kein Seed. Eine Quest
existiert als ausgefüllte Knotenliste. Fehlt ein Knoten, ist sie eine Notiz.

**Lesen vor dem ersten Satz:** `references/heft-grenzen.md`.

Knoten, in dieser Reihenfolge:

Trigger → Geber → Aufgabe → Hinweise → Konflikt → Entscheidung → Konsequenz → Belohnung → Welt → Folge

---

## Pflicht vor jedem Auftrag

1. Geber und alle NPCs stehen im Heft oder als offene Rolle. Keine neuen Vornamen.
2. Jeder Trigger hängt an einer Katalog-ID, nicht an „irgendwo in der Stadt“.
3. Spieler hören nur **Was glaubt der Spieler**. Twist und Wahrheit bleiben hinterm Schirm.
4. Gespräch beginnt, wenn jemand redet. Ankunft am Ort ist frei — nicht hinter Würfeln.
5. Keime bleiben still, bis der SL sie zieht. Quest in der Nähe zieht sie nicht.
6. Kein Bürgermeister, kein Preisblatt, kein WARHAMMER-Wort, kein Hospiz.

---

## 1. Metadaten — festlegen, nicht erzählen

Tun: Name, Typ, Schwierigkeit (leicht/mittel/hart), wen du brauchst (Karriere, kein D&D-Level), Fraktion (Gilde / Amt / keine / leer), Bezirk, einmal oder wiederholbar, was vorher fertig sein muss, welche Quest danach kommt.

Sagen: nichts davon am Tisch, außer den Namen wenn sie den Auftrag annehmen.

---

## 2. Einstieg — wie sie ihn kriegen

Tun: für **jeden** Weg Art, Haus-ID, NPC aus den Leuten, Bedingung, Chance (immer oder Würfel), einmalig ja/nein.

Arten: Brief, Gespräch, Gerücht, Fundstück, Gebiet betreten, Kampf, Leiche, Schatzkarte, Ereignis, Brett, Händler, Fraktion, Zufall.

Sagen: nur den Weg, den sie gerade treffen. Die anderen Wege existieren, du ziehst sie nicht.

---

## 3. Geber — eine Person sprechen lassen

Tun: Heftname oder offene Rolle; Alter, Beruf, Stand am Haus; wen er kennt; wen er fürchtet; was er will; was er verheimlicht; warum jetzt.

Sagen: Sätze aus Motiv und Angst. Ohne Motiv redet er wie ein Schild.

---

## 4. Erzählung — zwei Wahrheiten

| Feld | Tun | Sagen |
|---|---|---|
| Was glaubt der Spieler | einen Satz, den sie glauben sollen | ja, wenn der Auftrag liegt |
| Was wirklich war | intern, Heft-treu | nein |
| Twist | intern, bis sie ihn finden | erst dann |
| Wahrheit am Ende | intern; oft nicht der Geber | erst am Ende |

Vier Sätze gleich laut vorlesen = keine Quest.

---

## 5. Ziele — Erfolg und Scheitern

Tun, pro Ziel: Hör-Satz („holt das helle Brot“, nicht „Hauptquest 1“); Art (verhandeln, holen, beschützen, entscheiden, stehlen, infiltrieren…); Pflicht oder optional; wann geschafft; wann vorbei ohne Sieg; was sie dafür kriegen.

Sagen: den Hör-Satz. Scheitern aussprechen, wenn es eintritt. Ohne Scheiterbedingung läuft sie ewig.

---

## 6. Welt — nachher etwas ändern

Tun: wer anders redet; welches Haus anders aussieht; welcher Händler da ist oder fehlt; welche Fraktion das merkt.

Sagen: die Änderung beim **nächsten** Besuch, nicht vorher. Sonst war’s ein Dialog.

---

## 7. Baum — Zweige vor der Wahl

Tun, mindestens: mit dem Geber / gegen den Geber / nichts tun; darunter ehrlich oder mit Druck. Zu jedem Zweig: was du sagst, was die Stadt tut.

Sagen: den Zweig, den sie wählen. Liegt keiner: nächsten passenden nehmen. Keinen Kult erfinden.

---

## 8. Belohnung — sichtbar und still

Sagen: Groschen, ein Ding, Erfahrung. Kein Preisblatt.

Nicht als Zahl vorlesen: Ruf, wer sie noch grüßt, welcher Laden aufgeht, welche Quest jetzt möglich ist.

---

## 9. Lore — gegen das Heft

Tun: Orte, Leute, Fraktionen, Ereignis, Jahr 2512 gegen Katalog und `heft-grenzen.md` halten.

Widerspruch zum Heft = die Quest ist falsch, nicht das Heft.

---

## 10. Fünf Antworten, parat

Wenn sie handeln, **eine** Variante, nicht alle:

| Sie tun | Du sagst / tust |
|---|---|
| Wahrscheinliches | den vorbereiteten Satz des Gebers |
| Anderen Weg | den zweiten Trigger, keine neue Person |
| Kreatives | Gerücht, das am Ort schon im Heft steht |
| Chaotisches | Alltag zerbricht, kein Kampfzwang |
| Böses | Konsequenz, Ruf, ob jemand die Wache ruft |

Zu jeder Variante vorher notieren: NPC-Reaktion, Kampf ja/nein, neue Quest ja/nein.

---

## Nicht tun

- Wahrheit vorlesen, weil sie auf der Liste steht
- Würfeln, damit sie den Ort sehen
- Gespräch starten, bevor jemand redet
- Keim ziehen, nur weil die Quest in der Nähe ist
- Läden mit Preisliste spielen
- Quest-UI, `/quest`, Seed oder „Wer das Korn hat“ ins Projekt laden, außer der Nutzer verlangt es ausdrücklich (drei Reihen: verlangt)

## Fertig, wenn

Alle zehn Knoten haben Inhalt. Geber und Trigger sind Heft. Spieler-Satz und Wahrheit sind verschieden. Ein Haus oder ein Mund ändert sich nach dem Ende.
