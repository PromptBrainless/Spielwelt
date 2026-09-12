import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { GrokStudio } from "@/components/grok-studio";
import { PlaceImage } from "@/components/place-image";
import { PlacePills } from "@/components/pills";
import { districtByKey, neighborPlaces, photoSrc, placeById } from "@/lib/catalog";
import { mergePlace, useCatalog, type PlacePatch } from "@/lib/store";

export const Route = createFileRoute("/ort/$id")({
  component: OrtPage,
});

const FIELDS: { key: keyof PlacePatch; label: string; sl?: boolean }[] = [
  { key: "name", label: "Name" },
  { key: "typ", label: "Typ" },
  { key: "stand", label: "Stand" },
  { key: "kanon", label: "Kanon" },
  { key: "sieht", label: "Man sieht" },
  { key: "riecht", label: "Man riecht" },
  { key: "wer", label: "Wer hier ist" },
  { key: "geruecht", label: "Gerücht", sl: true },
  { key: "sl", label: "Für die Spielleitung", sl: true },
  { key: "am_tisch", label: "Am Tisch" },
];

function OrtPage() {
  const { id } = Route.useParams();
  const customPlaces = useCatalog((s) => s.customPlaces);
  const raw = placeById(id, customPlaces);
  const patches = useCatalog((s) => s.patches);
  const hideSl = useCatalog((s) => s.hideSl);
  const notes = useCatalog((s) => s.notes);
  const setNote = useCatalog((s) => s.setNote);
  const patchPlace = useCatalog((s) => s.patchPlace);
  const [editing, setEditing] = useState(false);
  const [rev, setRev] = useState(0);

  if (!raw) {
    return (
      <AppShell>
        <p>Ort {id} fehlt.</p>
      </AppShell>
    );
  }

  const place = mergePlace(raw, patches);
  const d = districtByKey(place.district);
  const { prev, next } = neighborPlaces(place.id, customPlaces);

  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap gap-2">
        {d ? (
          <Link
            to="/bezirk/$key"
            params={{ key: d.key }}
            className="rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline"
          >
            ← {d.short}
          </Link>
        ) : null}
        {prev ? (
          <Link
            to="/ort/$id"
            params={{ id: prev.id }}
            className="rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline"
          >
            ◀ {prev.id}
          </Link>
        ) : null}
        {next ? (
          <Link
            to="/ort/$id"
            params={{ id: next.id }}
            className="rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline"
          >
            {next.id} ▶
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className={
            "rounded-full border px-3 py-1.5 font-sans text-[13px] " +
            (editing
              ? "border-[#5a2410] bg-accent text-paper-2"
              : "border-line-strong bg-card text-ink")
          }
        >
          {editing ? "Ansicht" : "Bearbeiten"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-[22px] border border-line bg-card">
            <PlaceImage
              id={place.id}
              fallback={photoSrc(place)}
              alt={place.name}
              revision={rev}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
        <div>
          <PlacePills place={place} />
          {FIELDS.map((f) => {
            if (hideSl && f.sl && !editing) return null;
            const value = String(place[f.key] ?? "");
            if (!editing && !value) return null;
            return (
              <div key={f.key} className="mt-4">
                <div className="font-sans text-xs uppercase tracking-wider text-mute">{f.label}</div>
                {editing ? (
                  <textarea
                    value={value}
                    onChange={(e) => patchPlace(place.id, { [f.key]: e.target.value })}
                    rows={f.key === "name" || f.key === "typ" || f.key === "stand" ? 1 : 3}
                    className="mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px]"
                  />
                ) : (
                  <p className="mt-1 whitespace-pre-wrap leading-relaxed">{value}</p>
                )}
              </div>
            );
          })}
          <div className="mt-4">
            <div className="font-sans text-xs uppercase tracking-wider text-mute">Eigene SL-Notiz</div>
            {editing ? (
              <textarea
                value={notes[place.id] || ""}
                onChange={(e) => setNote(place.id, e.target.value)}
                rows={3}
                className="mt-1 w-full rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[15px]"
              />
            ) : (
              <p className="mt-1 text-ink-soft">{notes[place.id] || "—"}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <GrokStudio
          place={place}
          district={d}
          onImageChange={() => setRev((n) => n + 1)}
        />
      </div>
    </AppShell>
  );
}
