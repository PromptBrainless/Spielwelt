import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { SlGate } from "@/components/sl-gate";
import { allPlaces, catalog, emptyPlace, slugId } from "@/lib/catalog";
import { grokStatus, ingestUpload } from "@/lib/grok/server";
import {
  exportStoredImages,
  importStoredImages,
  putPlaceImage,
} from "@/lib/photos";
import { useCatalog, type PlacePatch } from "@/lib/store";
import type { CatalogPacket } from "@/lib/types";

export const Route = createFileRoute("/eingang")({
  component: () => (
    <SlGate>
      <EingangPage />
    </SlGate>
  ),
});

type ImageDraft = {
  key: string;
  preview: string;
  blob: Blob;
  fileName: string;
  name: string;
  district: string;
  attachTo: string;
};

function uniqueId(base: string, taken: Set<string>): string {
  let id = base || `neu-${Date.now().toString(36)}`;
  let n = 2;
  while (taken.has(id)) {
    id = `${base}-${n}`;
    n += 1;
  }
  return id;
}

function EingangPage() {
  const customPlaces = useCatalog((s) => s.customPlaces);
  const extraPages = useCatalog((s) => s.extraPages);
  const patches = useCatalog((s) => s.patches);
  const notes = useCatalog((s) => s.notes);
  const districtPatches = useCatalog((s) => s.districtPatches);
  const patchPlace = useCatalog((s) => s.patchPlace);
  const upsertCustomPlace = useCatalog((s) => s.upsertCustomPlace);
  const patchDistrict = useCatalog((s) => s.patchDistrict);
  const upsertPage = useCatalog((s) => s.upsertPage);
  const removePage = useCatalog((s) => s.removePage);
  const removeCustomPlace = useCatalog((s) => s.removeCustomPlace);
  const importPacket = useCatalog((s) => s.importPacket);
  const setNote = useCatalog((s) => s.setNote);

  const places = useMemo(() => allPlaces(customPlaces), [customPlaces]);
  const [hint, setHint] = useState<"auto" | "place" | "district" | "page">("auto");
  const [targetId, setTargetId] = useState("");
  const [targetDistrict, setTargetDistrict] = useState(catalog.districts[0]?.key ?? "");
  const [text, setText] = useState("");
  const [images, setImages] = useState<ImageDraft[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  const taken = useMemo(() => new Set(places.map((p) => String(p.id))), [places]);

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  async function addFiles(list: FileList | File[]) {
    const next: ImageDraft[] = [];
    let pasted = text;
    for (const file of Array.from(list)) {
      if (file.type.startsWith("image/")) {
        next.push({
          key: `${file.name}-${file.size}-${file.lastModified}`,
          preview: URL.createObjectURL(file),
          blob: file,
          fileName: file.name,
          name: file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "),
          district: targetDistrict,
          attachTo: targetId,
        });
      } else if (
        file.type.startsWith("text/") ||
        /\.(txt|md|json|csv)$/i.test(file.name)
      ) {
        pasted = (pasted ? pasted + "\n\n" : "") + (await file.text());
      } else {
        setErr(`Datei ${file.name} wird nicht gelesen. Bilder, Text, Markdown oder JSON.`);
      }
    }
    if (next.length) setImages((cur) => [...cur, ...next]);
    if (pasted !== text) setText(pasted);
  }

  async function ingestText() {
    setErr("");
    setBusy(true);
    try {
      const status = await grokStatus();
      if (!status.available) {
        setErr("Grok ist gerade nicht erreichbar. Du kannst Felder unten trotzdem von Hand übernehmen.");
        return;
      }
      const res = await ingestUpload({
        data: {
          text,
          hint,
          targetId: targetId || undefined,
          targetDistrict: targetDistrict || undefined,
          places: places.map((p) => ({ id: String(p.id), name: p.name, district: p.district })),
          districts: catalog.districts.map((d) => ({ key: d.key, name: d.name })),
        },
      });
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      const d = res.draft;
      if (d.kind === "place-update" && d.placeId) {
        const patch = (d.patch || {}) as PlacePatch;
        patchPlace(d.placeId, patch);
        if (d.body && !patch.sl) setNote(d.placeId, d.body);
        setMsg(`Ort ${d.placeId} aktualisiert. ${d.summary || ""}`);
      } else if (d.kind === "place-new") {
        const district = d.districtKey || targetDistrict;
        const id = uniqueId(slugId(d.name || "neuer-ort"), taken);
        upsertCustomPlace(
          emptyPlace({
            id,
            name: d.name || "Neuer Ort",
            district,
            ...(d.patch as PlacePatch),
          }),
        );
        setMsg(`Neue Seite ${id} angelegt. ${d.summary || ""}`);
      } else if (d.kind === "district" && (d.districtKey || targetDistrict)) {
        const key = d.districtKey || targetDistrict;
        patchDistrict(key, {
          intro: d.body || undefined,
          fabric: d.title || undefined,
        });
        setMsg(`Bezirk ${key} aktualisiert.`);
      } else if (d.kind === "page") {
        const id = uniqueId(slugId(d.title || "sl-notiz"), new Set(extraPages.map((p) => p.id)));
        upsertPage({
          id,
          title: d.title || "SL-Seite",
          body: d.body || text,
          district: d.districtKey || targetDistrict,
        });
        setMsg(`Neue SL-Seite angelegt.`);
      } else {
        setErr("Grok konnte den Text nicht zuordnen. Zielort oder Bezirk fester wählen.");
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Einsortieren fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  async function commitImages() {
    setErr("");
    let n = 0;
    const used = new Set(taken);
    for (const img of images) {
      if (img.attachTo) {
        await putPlaceImage(img.attachTo, img.blob);
        n += 1;
        continue;
      }
      const id = uniqueId(slugId(img.name), used);
      used.add(id);
      upsertCustomPlace(
        emptyPlace({
          id,
          name: img.name || "Neue Ansicht",
          district: img.district,
          sieht: `Neue Ansicht aus Datei ${img.fileName}.`,
        }),
      );
      await putPlaceImage(id, img.blob);
      n += 1;
    }
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setMsg(`${n} Bild${n === 1 ? "" : "er"} übernommen.`);
  }

  function saveTextByHand() {
    if (!text.trim()) {
      setErr("Kein Text.");
      return;
    }
    if (hint === "district") {
      patchDistrict(targetDistrict, { intro: text.trim() });
      setMsg("Bezirkstext übernommen.");
      return;
    }
    if (hint === "page") {
      const id = uniqueId(slugId("sl-notiz"), new Set(extraPages.map((p) => p.id)));
      upsertPage({ id, title: "SL-Notiz", body: text.trim(), district: targetDistrict });
      setMsg("SL-Seite angelegt.");
      return;
    }
    if (targetId) {
      patchPlace(targetId, { sl: text.trim() });
      setNote(targetId, text.trim());
      setMsg(`Als SL-Text an ${targetId} gelegt.`);
      return;
    }
    const id = uniqueId(slugId("neuer-ort"), taken);
    upsertCustomPlace(emptyPlace({ id, name: "Neuer Ort", district: targetDistrict, sl: text.trim() }));
    setMsg(`Neue Seite ${id} mit dem Text.`);
  }

  async function exportPaket() {
    const imagesOut = await exportStoredImages();
    const packet: CatalogPacket = {
      v: 1,
      patches: patches as CatalogPacket["patches"],
      notes,
      customPlaces,
      districtPatches,
      extraPages,
      images: imagesOut,
    };
    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "drosselau-paket.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setMsg("Paket gespeichert. Bilder, die du ersetzt oder neu gelegt hast, sind drin.");
  }

  async function importFile(file: File | null) {
    if (!file) return;
    setErr("");
    try {
      const packet = JSON.parse(await file.text()) as CatalogPacket;
      importPacket(packet);
      if (packet.images) {
        const n = await importStoredImages(packet.images);
        setMsg(`Paket geladen. ${n} Bilder wiederhergestellt.`);
      } else {
        setMsg("Paket geladen.");
      }
    } catch {
      setErr("Diese Datei ist kein Drosselau-Paket.");
    }
  }

  return (
    <AppShell>
      <h1 className="font-serif text-4xl">Eingang</h1>
      <p className="mt-2 max-w-[62ch] text-[18px] leading-relaxed text-ink-soft">
        Hier schickst du Material direkt in den Katalog: erneuerte Bezirkstexte, SL-Notizen, Fotos auf
        bestehende Orte oder ganz neue Seiten. Grok liest Fließtext und legt ihn in die Felder. Alles bleibt
        in diesem Browser, bis du ein Paket exportierst.
      </p>

      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void addFiles(e.dataTransfer.files);
        }}
        className={
          "mt-8 block cursor-pointer rounded-[22px] border-2 border-dashed px-6 py-10 text-center " +
          (drag ? "border-accent bg-card" : "border-line bg-card/70")
        }
      >
        <div className="font-serif text-xl">Dateien ablegen</div>
        <p className="mt-2 text-ink-soft">
          Bilder werden zu Schildern. TXT, MD oder JSON landet im Textfeld. PDF bitte als Text
          kopieren.
        </p>
        <input
          type="file"
          multiple
          accept="image/*,.txt,.md,.json,.csv,text/plain"
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) void addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <label className="block font-sans text-xs uppercase tracking-wider text-mute">
          Das ist
          <select
            id="intake-hint"
            value={hint}
            onChange={(e) => setHint(e.target.value as typeof hint)}
            className="mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px] text-ink"
          >
            <option value="auto">Grok entscheidet</option>
            <option value="place">Ortstext / SL-Info</option>
            <option value="district">Bezirkstext</option>
            <option value="page">Neue SL-Seite</option>
          </select>
        </label>
        <label className="block font-sans text-xs uppercase tracking-wider text-mute">
          Bestehender Ort
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px] text-ink"
          >
            <option value="">— neuer Ort oder unklar —</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {p.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block font-sans text-xs uppercase tracking-wider text-mute">
          Bezirk
          <select
            value={targetDistrict}
            onChange={(e) => setTargetDistrict(e.target.value)}
            className="mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px] text-ink"
          >
            {catalog.districts.map((d) => (
              <option key={d.key} value={d.key}>
                {d.num} · {d.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block font-sans text-xs uppercase tracking-wider text-mute">
        Text
        <textarea
          id="intake-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Erneuerten Gassenkanon, Gerücht, SL-Notiz oder ganzen Bezirkstext hierher."
          className="mt-1 w-full rounded-[22px] border border-line bg-card px-4 py-3 font-serif text-[16px] leading-relaxed"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || !text.trim()}
          onClick={() => void ingestText()}
          className="rounded-full border border-[#5a2410] bg-accent px-3.5 py-2 font-sans text-[13px] text-paper-2 disabled:opacity-50"
        >
          {busy ? "Grok liest…" : "Grok einsortieren"}
        </button>
        <button
          type="button"
          disabled={!text.trim()}
          onClick={saveTextByHand}
          className="rounded-full border border-line-strong bg-card px-3.5 py-2 font-sans text-[13px] text-ink disabled:opacity-50"
        >
          Ohne Grok übernehmen
        </button>
      </div>

      {images.length > 0 ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">Bilder in der Warteschlange</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {images.map((img, i) => (
              <article key={img.key} className="overflow-hidden rounded-[22px] border border-line bg-card">
                <img src={img.preview} alt="" className="h-40 w-full object-cover" />
                <div className="space-y-2 p-3">
                  <input
                    value={img.name}
                    onChange={(e) =>
                      setImages((cur) => cur.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                    }
                    className="w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif"
                  />
                  <select
                    value={img.district}
                    onChange={(e) =>
                      setImages((cur) =>
                        cur.map((x, j) => (j === i ? { ...x, district: e.target.value } : x)),
                      )
                    }
                    className="w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif"
                  >
                    {catalog.districts.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.num} · {d.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={img.attachTo}
                    onChange={(e) =>
                      setImages((cur) =>
                        cur.map((x, j) => (j === i ? { ...x, attachTo: e.target.value } : x)),
                      )
                    }
                    className="w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif"
                  >
                    <option value="">Neue Seite aus diesem Bild</option>
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        Ersetzt {p.id} · {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      URL.revokeObjectURL(img.preview);
                      setImages((cur) => cur.filter((_, j) => j !== i));
                    }}
                    className="font-sans text-sm text-accent"
                  >
                    Verwerfen
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void commitImages()}
            className="mt-4 rounded-full border border-[#5a2410] bg-accent px-3.5 py-2 font-sans text-[13px] text-paper-2"
          >
            Bilder übernehmen
          </button>
        </section>
      ) : null}

      {err ? <p className="mt-4 text-accent">{err}</p> : null}
      {msg ? <p className="mt-4 text-pine">{msg}</p> : null}

      <section className="mt-12">
        <h2 className="font-serif text-2xl">Eigene Seiten</h2>
        {customPlaces.length === 0 && extraPages.length === 0 ? (
          <p className="text-ink-soft">Noch keine. Ein Bild ohne Zielort oder „Neue SL-Seite“ legt welche an.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {customPlaces.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-2">
                <Link to="/ort/$id" params={{ id: p.id }} className="text-accent no-underline hover:underline">
                  {p.id} · {p.name}
                </Link>
                <button
                  type="button"
                  onClick={() => removeCustomPlace(p.id)}
                  className="font-sans text-sm text-mute"
                >
                  Entfernen
                </button>
              </li>
            ))}
            {extraPages.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-2">
                <Link to="/seite/$id" params={{ id: p.id }} className="text-accent no-underline hover:underline">
                  Seite · {p.title}
                </Link>
                <button type="button" onClick={() => removePage(p.id)} className="font-sans text-sm text-mute">
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12 rounded-[22px] border border-line bg-card p-5">
        <h2 className="m-0 font-serif text-2xl">Paket</h2>
        <p className="mt-2 text-ink-soft">
          Texte, neue Seiten und ersetzte Bilder liegen lokal. Ein JSON-Paket nimmst du mit auf einen
          anderen Rechner. Kanon-Heftfotos sind schon in der App und müssen nicht mit.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void exportPaket()}
            className="rounded-full border border-line-strong bg-paper-2 px-3.5 py-2 font-sans text-[13px]"
          >
            Paket exportieren
          </button>
          <label className="rounded-full border border-line-strong bg-paper-2 px-3.5 py-2 font-sans text-[13px]">
            Paket importieren
            <input
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => void importFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
        <p className="mt-3 font-sans text-xs text-mute">
          {Object.keys(patches).length} Textänderungen · {customPlaces.length} neue Orte ·{" "}
          {extraPages.length} SL-Seiten · {catalog.count} Kanonorte.
        </p>
      </section>
    </AppShell>
  );
}
