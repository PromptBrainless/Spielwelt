import { useEffect, useRef, useState } from "react";
import { perceptionClues, pickClueIndex } from "@/lib/clues";
import { formatRoll, rollD100, testSkill, type WfrpRoll } from "@/lib/wfrp";
import { useCatalog } from "@/lib/store";
import type { Place } from "@/lib/types";

const NONE: number[] = [];

function Die({
  label,
  value,
  spinning,
}: {
  label: string;
  value: number;
  spinning: boolean;
}) {
  const face = label === "Zehner" ? `${value}0`.slice(-2) : String(value);
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={
          "die-face font-sans text-2xl tabular-nums " + (spinning ? "die-spin" : "")
        }
        aria-hidden
      >
        {face}
      </div>
      <span className="kicker">{label}</span>
    </div>
  );
}

export function Wahrnehmen({ place }: { place: Place }) {
  const clues = perceptionClues(place);
  const skill = useCatalog((s) => s.wahrnehmung);
  const setSkill = useCatalog((s) => s.setWahrnehmung);
  const revealed = useCatalog((s) => s.revealed[place.id]) ?? NONE;
  const revealClue = useCatalog((s) => s.revealClue);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState({ tens: 0, units: 0 });
  const [last, setLast] = useState<WfrpRoll | null>(null);
  const [note, setNote] = useState("");
  const running = useRef(false);

  useEffect(() => {
    setLast(null);
    setNote("");
  }, [place.id]);

  function roll() {
    if (running.current || clues.length === 0) return;
    running.current = true;
    setBusy(true);
    setNote("");
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const end = rollD100();
    const started = Date.now();
    const tick = () => {
      const elapsed = Date.now() - started;
      if (!reduced && elapsed < 700) {
        setPreview({
          tens: Math.floor(Math.random() * 10),
          units: Math.floor(Math.random() * 10),
        });
        window.setTimeout(() => requestAnimationFrame(tick), 40);
        return;
      }
      setPreview({ tens: end.tens, units: end.units });
      const result = testSkill(skill, end);
      setLast(result);
      if (!result.success) {
        setNote("Nichts weiter als das Offensichtliche.");
      } else {
        const index = pickClueIndex(result.sl, revealed, clues.length);
        if (index == null) setNote("Mehr fällt an diesem Ort nicht auf.");
        else revealClue(place.id, index);
      }
      running.current = false;
      setBusy(false);
    };
    requestAnimationFrame(tick);
  }

  const tens = last && !busy ? last.tens : preview.tens;
  const units = last && !busy ? last.units : preview.units;

  return (
    <div className="mt-6 max-w-[62ch]">
      <p className="text-ink-soft">Ihr steht davor. Mehr ist ohne Hinsehen nicht da.</p>

      <div className="mt-5 flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="kicker">Wahrnehmung</span>
          <input
            type="number"
            min={1}
            max={99}
            value={skill}
            onChange={(e) => setSkill(Number(e.target.value))}
            className="mt-1 w-[4.5rem] rounded-sm border border-line bg-card px-2 py-2 font-sans text-[16px] tabular-nums"
          />
        </label>
        <button
          type="button"
          onClick={roll}
          disabled={busy || clues.length === 0}
          className="rounded-full border border-[#5a2410] bg-accent px-4 py-2 font-sans text-[13px] text-paper-2 disabled:opacity-50"
        >
          {busy ? "Würfeln…" : "Wahrnehmen"}
        </button>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <Die label="Zehner" value={tens} spinning={busy} />
        <Die label="Einer" value={units} spinning={busy} />
        {last && !busy ? (
          <p className="font-sans text-sm tabular-nums text-ink-soft">{formatRoll(last)}</p>
        ) : null}
      </div>

      {note && !busy ? <p className="mt-4 italic text-ink-soft">{note}</p> : null}

      {revealed.length > 0 ? (
        <div className="mt-6 space-y-5">
          {revealed.map((i) => (
            <p key={i} className="whitespace-pre-wrap text-[18px] leading-relaxed">
              {clues[i]}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
