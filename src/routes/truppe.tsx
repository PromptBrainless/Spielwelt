import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import {
  AUSBAU,
  CHARS,
  GRUND,
  emptyCharacter,
  skillTarget,
  trained,
  type Character,
  type CharKey,
  type SkillDef,
} from "@/lib/wfrp";
import { useCatalog } from "@/lib/store";

export const Route = createFileRoute("/truppe")({
  component: TruppePage,
});

function TruppePage() {
  const party = useCatalog((s) => s.party);
  const upsert = useCatalog((s) => s.upsertCharacter);
  const remove = useCatalog((s) => s.removeCharacter);
  const sl = useCatalog((s) => s.sicht) === "sl";

  return (
    <AppShell>
      <p className="kicker m-0">{sl ? "Schirm" : "Am Tisch"}</p>
      <h1 className="mt-2 font-serif text-4xl">Truppe</h1>
      <div className="folio-rule mt-4" />
      <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-ink-soft">
        10 Werte, 45 Fähigkeiten aus dem Buch. Grund immer. Ausbau grau, bis eine Steigerung liegt.
      </p>
      <button
        type="button"
        onClick={() => upsert(emptyCharacter("Neue Person"))}
        className="mt-6 rounded-full border border-[#5a2410] bg-accent px-4 py-2 font-sans text-[13px] text-paper-2"
      >
        Charakter anlegen
      </button>
      <div className="mt-8 space-y-10">
        {party.length === 0 ? (
          <p className="text-ink-soft">Noch niemand. Werte bleiben bei euch, bis sie hier stehen.</p>
        ) : (
          party.map((pc) => (
            <Sheet key={pc.id} pc={pc} onChange={upsert} onRemove={() => remove(pc.id)} />
          ))
        )}
      </div>
    </AppShell>
  );
}

function SkillRows({
  title,
  rows,
  pc,
  onChange,
}: {
  title: string;
  rows: SkillDef[];
  pc: Character;
  onChange: (c: Character) => void;
}) {
  function setAdv(key: string, n: number) {
    onChange({ ...pc, advances: { ...pc.advances, [key]: Math.max(0, Math.min(40, n || 0)) } });
  }
  function setSpec(key: string, v: string) {
    onChange({ ...pc, specs: { ...pc.specs, [key]: v } });
  }

  return (
    <>
      <p className="kicker mt-6">{title}</p>
      <ul className="mt-2 grid list-none grid-cols-1 gap-1 p-0 sm:grid-cols-2">
        {rows.map((s) => {
          const adv = pc.advances[s.key] ?? 0;
          const ok = trained(pc, s.key);
          const target = ok ? skillTarget(pc, s.key, 0) : "—";
          return (
            <li
              key={s.key}
              className={
                "flex flex-wrap items-center justify-between gap-2 border-b border-line/60 py-1 " +
                (ok ? "" : "opacity-45")
              }
            >
              <span className="text-[15px]">
                {s.name}{" "}
                <span className="font-sans text-[11px] text-mute">
                  {CHARS.find((c) => c.key === s.char)?.short} {target}
                </span>
              </span>
              <span className="flex items-center gap-2">
                {s.specs.length > 0 ? (
                  <select
                    value={pc.specs[s.key] || ""}
                    onChange={(e) => setSpec(s.key, e.target.value)}
                    className="max-w-[9rem] rounded-sm border border-line bg-card px-1 py-0.5 font-sans text-[11px]"
                  >
                    <option value="">Spez.</option>
                    {s.specs.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                ) : null}
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={adv}
                  onChange={(e) => setAdv(s.key, Number(e.target.value))}
                  className="w-14 rounded-sm border border-line px-2 py-0.5 text-right font-serif tabular-nums"
                  aria-label={`${s.name} Steigerung`}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Sheet({
  pc,
  onChange,
  onRemove,
}: {
  pc: Character;
  onChange: (c: Character) => void;
  onRemove: () => void;
}) {
  function setChar(key: CharKey, n: number) {
    onChange({ ...pc, chars: { ...pc.chars, [key]: Math.max(1, Math.min(99, n || 0)) } });
  }

  return (
    <article className="rounded-md border border-line bg-card p-4">
      <div className="flex flex-wrap gap-3">
        <label className="flex-1 font-sans text-[12px] text-mute">
          Name
          <input
            value={pc.name}
            onChange={(e) => onChange({ ...pc, name: e.target.value })}
            className="mt-1 w-full rounded-sm border border-line px-2 py-1 font-serif text-lg text-ink"
          />
        </label>
        <label className="flex-1 font-sans text-[12px] text-mute">
          Karriere
          <input
            value={pc.career}
            onChange={(e) => onChange({ ...pc, career: e.target.value })}
            className="mt-1 w-full rounded-sm border border-line px-2 py-1 font-serif text-lg text-ink"
          />
        </label>
        <button type="button" onClick={onRemove} className="self-end font-sans text-[12px] text-mute">
          Entfernen
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {CHARS.map((c) => (
          <label key={c.key} className="font-sans text-[11px] text-mute">
            {c.short} {c.name}
            <input
              type="number"
              min={1}
              max={99}
              value={pc.chars[c.key] ?? 30}
              onChange={(e) => setChar(c.key, Number(e.target.value))}
              className="mt-1 w-full rounded-sm border border-line px-2 py-1 font-serif text-lg tabular-nums text-ink"
            />
          </label>
        ))}
      </div>
      <SkillRows title={`Grund · ${GRUND.length}`} rows={GRUND} pc={pc} onChange={onChange} />
      <SkillRows title={`Ausbau · ${AUSBAU.length} · grau ohne Steigerung`} rows={AUSBAU} pc={pc} onChange={onChange} />
    </article>
  );
}
