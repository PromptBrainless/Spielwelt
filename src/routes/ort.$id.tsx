import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FieldEdit } from "@/components/field-edit";
import { GrokStudio } from "@/components/grok-studio";
import { PlaceImage } from "@/components/place-image";
import { PlacePills } from "@/components/pills";
import { PlayBlock } from "@/components/play-block";
import { PlayerBlock } from "@/components/player-block";
import { QuestCard } from "@/components/quest-card";
import { TalkPanel } from "@/components/talk-panel";
import { SlDossier, KeimCard } from "@/components/sl-dossier";
import { displayName, districtByKey, neighborPlaces, photoSrc, placeById, allPlaces } from "@/lib/catalog";
import { peopleAtPlace } from "@/data/npcs";
import { META_FIELDS, SL_FIELDS, TISCH_FIELDS, type PlaceField } from "@/lib/sicht";
import { mergePlace, useCatalog, type PlacePatch } from "@/lib/store";
import type { Place } from "@/lib/types";

export const Route = createFileRoute("/ort/$id")({
  component: OrtPage,
});

function FieldList({
  fields,
  place,
  places,
  editing,
  onPatch,
}: {
  fields: PlaceField[];
  place: Place;
  places: Place[];
  editing: boolean;
  onPatch: (patch: PlacePatch) => void;
}) {
  return (
    <>
      {fields.map((f) => {
        const value = String(place[f.key] ?? "");
        if (editing) {
          return (
            <FieldEdit
              key={f.key}
              field={f}
              place={place}
              places={places}
              onPatch={onPatch}
            />
          );
        }
        if (!value) return null;
        return (
          <div key={f.key} className="mt-4">
            <div className="kicker">{f.label}</div>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{value}</p>
          </div>
        );
      })}
    </>
  );
}

function OrtPage() {
  const { id } = Route.useParams();
  const customPlaces = useCatalog((s) => s.customPlaces);
  const raw = placeById(id, customPlaces);
  const patches = useCatalog((s) => s.patches);
  const sicht = useCatalog((s) => s.sicht);
  const notes = useCatalog((s) => s.notes);
  const setNote = useCatalog((s) => s.setNote);
  const patchPlace = useCatalog((s) => s.patchPlace);
  const extraPeople = useCatalog((s) => s.extraPeople);
  const [editing, setEditing] = useState(false);
  const [rev, setRev] = useState(0);
  const sl = sicht === "sl";

  useEffect(() => {
    if (!sl) setEditing(false);
  }, [sl]);

  if (!raw) {
    return (
      <AppShell>
        <p>Dieser Ort fehlt im Katalog.</p>
      </AppShell>
    );
  }

  const place = mergePlace(raw, patches);
  const places = allPlaces(customPlaces).map((p) => mergePlace(p, patches));
  const here = peopleAtPlace(place.id, extraPeople);
  const d = districtByKey(place.district);
  const { prev, next } = neighborPlaces(place.id, customPlaces);
  const tischView = TISCH_FIELDS.filter(
    (f) => f.key !== "spieltext" && f.key !== "spielkern" && f.key !== "szene",
  );
  const tischEdit = [
    ...META_FIELDS,
    ...TISCH_FIELDS,
    { key: "eskalation" as const, label: "Gespräch", sicht: "sl" as const },
  ];

  return (
    <AppShell>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {d ? (
          <Link
            to="/bezirk/$key"
            params={{ key: d.key }}
            className="rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline"
          >
            {d.short}
          </Link>
        ) : null}
        {prev ? (
          <Link
            to="/ort/$id"
            params={{ id: prev.id }}
            className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline"
          >
            <ChevronLeft className="size-3.5" />
            {sl ? prev.id : displayName(prev).split("·")[0].trim()}
          </Link>
        ) : null}
        {next ? (
          <Link
            to="/ort/$id"
            params={{ id: next.id }}
            className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-card px-3 py-1.5 font-sans text-[13px] text-ink no-underline"
          >
            {sl ? next.id : displayName(next).split("·")[0].trim()}
            <ChevronRight className="size-3.5" />
          </Link>
        ) : null}
        {sl ? (
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
            {editing ? "Fertig" : "Texte ändern"}
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <div className="plate">
            <PlaceImage
              id={place.id}
              fallback={photoSrc(place)}
              alt={displayName(place)}
              revision={rev}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          {d ? <p className="kicker mt-3">{d.name}</p> : null}
        </div>
        <div>
          <h1 className="m-0 font-serif text-4xl tracking-tight">{displayName(place)}</h1>
          {sl ? (
            <div className="mt-3">
              <PlacePills place={place} />
            </div>
          ) : null}

          {sl ? (
            editing ? (
              <FieldList
                fields={tischEdit}
                place={place}
                places={places}
                editing
                onPatch={(patch) => patchPlace(place.id, patch)}
              />
            ) : (
              <>
                <PlayBlock place={place} />
                <FieldList
                  fields={tischView}
                  place={place}
                  places={places}
                  editing={false}
                  onPatch={(patch) => patchPlace(place.id, patch)}
                />
              </>
            )
          ) : (
            <PlayerBlock place={place} />
          )}

          {sl ? (
            <section className="box-gm mt-8">
              <div className="kicker text-gold">Schirm</div>
              <KeimCard placeId={place.id} />
              <QuestCard placeId={place.id} />
              <TalkPanel people={here} />
              <SlDossier placeId={place.id} />
              {here.length > 0 ? (
                <div className="mt-4">
                  <div className="kicker text-gold">Leute</div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {here.map((p) => (
                      <li key={p.id}>
                        <Link to="/leute" className="text-gold no-underline hover:underline">
                          {p.name}
                        </Link>
                        {p.age ? ` · ${p.age}` : ""} · {p.role}
                        {!p.named ? " · offen" : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="text-paper-2">
                <FieldList
                  fields={SL_FIELDS}
                  place={place}
                  places={places}
                  editing={editing}
                  onPatch={(patch) => patchPlace(place.id, patch)}
                />
              </div>
              <div className="mt-4">
                <div className="kicker text-[#d8c7a4]">Eigene Notiz</div>
                {editing ? (
                  <textarea
                    value={notes[place.id] || ""}
                    onChange={(e) => setNote(place.id, e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-sm border border-[#5c4630] bg-[#2a1f14] px-3 py-2 font-serif text-[15px] text-paper-2"
                  />
                ) : (
                  <p className="mt-1 text-[#d8c7a4]">{notes[place.id] || "—"}</p>
                )}
              </div>
            </section>
          ) : null}
        </div>
      </div>
      {sl ? (
        <div className="mt-8">
          <GrokStudio
            place={place}
            district={d}
            onImageChange={() => setRev((n) => n + 1)}
          />
        </div>
      ) : null}
    </AppShell>
  );
}
