# Drosselau Ortskatalog — lokale Webapp

Vollständige Umwandlung des Heftes in eine beschreibbare Website.

## Öffnen

Die Datei `index.html` im Ordner `site` doppelklicken  
oder im Terminal:

```bash
cd site
python3 -m http.server 8765
```

Dann im Browser: http://127.0.0.1:8765/

Ein lokaler Server ist nur nötig, wenn der Browser `file://` für IndexedDB blockiert. Chromium/Firefox erlauben die App meist auch als Datei.

## Was enthalten ist

- 9 Bildbezirke wie im Heft: Vorstadt, Tor, Markt/Gilde, Schmiede, Weber, Krämer, Gerber, Morr-Ost, Schatten
- alle 118 Orte mit Kanon, Sicht, Geruch, Bewohner, Gerücht, SL, Am-Tisch
- 118 Katalogfotos
- Abgleich mit dem 69er-Straßenverzeichnis
- geplante Bildfolge (39 Packs, QA alle 10 %)
- harte Setzungen (Kulte, Keime, Verwechslungen)

## Aktiv bearbeiten

- Am Ort auf **Bearbeiten**
- Felder ändern, **Speichern** — landet in diesem Browser (localStorage)
- Eigenes Foto per Dateiwahl oder Drag-and-drop — landet in IndexedDB
- **Export JSON** sichert den bearbeiteten Katalog
- **Import** lädt eine Sicherung zurück
- **Kanon** verwirft lokale Textänderungen (hochgeladene Bilder bleiben, bis der Browser-Speicher geleert wird)
- **SL ausblenden** versteckt Spielleitung und Gerücht (Tischansicht)

## Dateien

| Datei | Rolle |
|---|---|
| `index.html` | App-Schale |
| `katalog.css` | Satzspiegel |
| `app.js` | Navigation, Editor, Bilder |
| `data.js` | 118 Orte + Bezirke + Packs |
| `fotos/` | Katalogbilder |
