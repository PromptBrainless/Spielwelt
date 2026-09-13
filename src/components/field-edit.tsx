import { fieldChoices, isShortField } from "@/lib/choices";
import type { PlaceField, PlaceFieldKey } from "@/lib/sicht";
import { useCatalog, type PlacePatch } from "@/lib/store";
import type { Place } from "@/lib/types";

const NONE: string[] = [];

function OptionGroup({ label, items }: { label: string; items: { value: string; label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <optgroup label={label}>
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </optgroup>
  );
}

export function FieldEdit({
  field,
  place,
  places,
  onPatch,
}: {
  field: PlaceField;
  place: Place;
  places: Place[];
  onPatch: (patch: PlacePatch) => void;
}) {
  const value = String(place[field.key] ?? "");
  const library = useCatalog((s) => s.library[field.key]) ?? NONE;
  const saveSnippet = useCatalog((s) => s.saveSnippet);
  const dropSnippet = useCatalog((s) => s.dropSnippet);
  const choices = fieldChoices(field.key, places, library, String(place.id));
  const saved = library.includes(value.trim());
  const short = isShortField(field.key);
  const hasChoices =
    choices.vorschlaege.length + choices.gemerkt.length + choices.katalog.length > 0;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="kicker">{field.label}</div>
        {value.trim() ? (
          <button
            type="button"
            onClick={() =>
              saved ? dropSnippet(field.key, value) : saveSnippet(field.key, value)
            }
            className="font-sans text-[12px] text-accent"
          >
            {saved ? "Aus Bibliothek nehmen" : "Für andere Orte merken"}
          </button>
        ) : null}
      </div>
      {hasChoices ? (
        <select
          className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-sans text-[13px] text-ink"
          defaultValue=""
          onChange={(e) => {
            const next = e.target.value;
            if (next) onPatch({ [field.key]: next } as PlacePatch);
            e.target.value = "";
          }}
        >
          <option value="">{short ? "Stand / Typ übernehmen…" : "Bereits genutzt übernehmen…"}</option>
          <OptionGroup label="Gemerkt" items={choices.gemerkt} />
          <OptionGroup label="Vorschläge" items={choices.vorschlaege} />
          <OptionGroup label="Im Katalog" items={choices.katalog} />
        </select>
      ) : null}
      <textarea
        value={value}
        onChange={(e) => onPatch({ [field.key]: e.target.value } as PlacePatch)}
        rows={short ? 1 : field.key === "eskalation" || field.key === "spieltext" ? 5 : 3}
        className="mt-1 w-full rounded-sm border border-line bg-card px-3 py-2 font-serif text-[15px]"
      />
    </div>
  );
}

export function SnippetSelect({
  label,
  keys,
  onPick,
}: {
  label: string;
  keys: PlaceFieldKey[];
  onPick: (text: string) => void;
}) {
  const library = useCatalog((s) => s.library);
  const groups = keys
    .map((key) => ({ key, items: library[key] || [] }))
    .filter((g) => g.items.length > 0);
  if (groups.length === 0) return null;
  return (
    <select
      className="w-full rounded-sm border border-line bg-card px-2 py-2 font-sans text-[13px]"
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) onPick(e.target.value);
        e.target.value = "";
      }}
    >
      <option value="">{label}</option>
      {groups.map((g) => (
        <optgroup key={g.key} label={g.key}>
          {g.items.map((item) => (
            <option key={item} value={item}>
              {item.replace(/\s+/g, " ").slice(0, 80)}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
