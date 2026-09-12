import { useEffect, useState } from "react";
import type { District, Place } from "@/lib/types";
import { coverSrc, photoSrc } from "@/lib/catalog";
import {
  blobToDataUri,
  clearPlaceImage,
  dataUriToBlob,
  fetchAsDataUri,
  getPlaceImageUrl,
  putPlaceImage,
} from "@/lib/photos";
import { coachEditPrompt, editPlaceImage, grokStatus } from "@/lib/grok/server";

export function GrokStudio({
  place,
  district,
  onImageChange,
}: {
  place: Place;
  district?: District;
  onImageChange: () => void;
}) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [intent, setIntent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [holdStyle, setHoldStyle] = useState(true);
  const [busy, setBusy] = useState<"coach" | "edit" | null>(null);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    void grokStatus().then((s) => setAvailable(s.available));
  }, []);

  async function currentDataUri(): Promise<string> {
    const fallback = photoSrc(place);
    const url = await getPlaceImageUrl(place.id, fallback);
    if (url.startsWith("blob:")) {
      const blob = await fetch(url).then((r) => r.blob());
      return blobToDataUri(blob);
    }
    return fetchAsDataUri(url);
  }

  async function sharpen() {
    setError("");
    setBusy("coach");
    try {
      const res = await coachEditPrompt({
        data: {
          intent,
          name: place.name,
          sieht: place.sieht,
          kanon: place.kanon,
          fabric: district?.fabric ?? "",
          intro: district?.intro ?? "",
        },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setPrompt(res.prompt);
      setNote("Auftrag geschärft. Prüfen, dann Bild bearbeiten.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Coach fehlgeschlagen.");
    } finally {
      setBusy(null);
    }
  }

  async function runEdit() {
    const job = (prompt || intent).trim();
    if (!job) {
      setError("Schreib, was Grok am Ortsschild ändern soll.");
      return;
    }
    setError("");
    setBusy("edit");
    try {
      const imageDataUri = await currentDataUri();
      let styleDataUri: string | undefined;
      if (holdStyle && district) {
        styleDataUri = await fetchAsDataUri(coverSrc(district));
      }
      const res = await editPlaceImage({
        data: { prompt: job, imageDataUri, styleDataUri },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      await putPlaceImage(place.id, dataUriToBlob(res.dataUri));
      setNote("Neues Schild liegt lokal in diesem Browser. Kanon stellt das Heftfoto wieder her.");
      onImageChange();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bearbeitung fehlgeschlagen.");
    } finally {
      setBusy(null);
    }
  }

  async function revert() {
    await clearPlaceImage(place.id);
    setNote("Heftfoto wieder aktiv.");
    onImageChange();
  }

  async function onFile(file: File | null) {
    if (!file) return;
    await putPlaceImage(place.id, file);
    setNote("Eigenes Foto gespeichert.");
    onImageChange();
  }

  if (available === false) {
    return (
      <section className="rounded-[22px] border border-line bg-card p-4">
        <h2 className="m-0 font-serif text-xl">Grok Bildwerkstatt</h2>
        <p className="mt-2 text-ink-soft">
          Die Imagine-API ist hier gerade nicht erreichbar. Du kannst trotzdem ein eigenes Foto legen.
        </p>
        <label className="mt-3 block font-sans text-sm text-mute">
          Eigenes Foto
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full"
            onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
          />
        </label>
      </section>
    );
  }

  return (
    <section className="rounded-[22px] border border-line bg-card p-4">
      <h2 className="m-0 font-serif text-xl">Grok Bildwerkstatt</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
        Grok sieht das aktuelle Ortsschild und den Stoff dieses Bezirks. Sag auf Deutsch, was falsch ist —
        nasser als das Heft, weniger Marmor, Ranald-X an der Tür. Grok schreibt den englischen Imagine-Auftrag
        und hält Bogen, Namensbanner und die Leiste DROSSELAU.
      </p>
      <label className="mt-4 block font-sans text-xs uppercase tracking-wider text-mute">
        Änderung
        <textarea
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          rows={3}
          placeholder="z. B. Der Matschweg tiefer, kein weißes Hospiz im Hintergrund, Rauch dünner."
          className="mt-1 w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif text-[15px] text-ink"
        />
      </label>
      <label className="mt-3 flex items-start gap-2 font-sans text-sm text-ink-soft">
        <input
          type="checkbox"
          className="mt-1"
          checked={holdStyle}
          onChange={(e) => setHoldStyle(e.target.checked)}
        />
        Stil an das Bezirksfoto koppeln (zweites Referenzbild)
      </label>
      {prompt ? (
        <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-mute">
          Imagine-Auftrag
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="mt-1 w-full rounded-[14px] border border-line bg-paper-2 px-3 py-2 font-serif text-[15px] text-ink"
          />
        </label>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void sharpen()}
          className="rounded-full border border-line-strong bg-paper-2 px-3.5 py-2 font-sans text-[13px] text-ink disabled:opacity-50"
        >
          {busy === "coach" ? "Grok schreibt…" : "Auftrag schärfen"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void runEdit()}
          className="rounded-full border border-[#5a2410] bg-accent px-3.5 py-2 font-sans text-[13px] text-paper-2 disabled:opacity-50"
        >
          {busy === "edit" ? "Schild wird gezeichnet…" : "Schild bearbeiten"}
        </button>
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => void revert()}
          className="rounded-full border border-line-strong bg-transparent px-3.5 py-2 font-sans text-[13px] text-ink disabled:opacity-50"
        >
          Heftfoto
        </button>
      </div>
      <label className="mt-3 block font-sans text-xs uppercase tracking-wider text-mute">
        Oder eigenes Foto
        <input
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm"
          onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      {note ? <p className="mt-2 text-sm text-pine">{note}</p> : null}
    </section>
  );
}
