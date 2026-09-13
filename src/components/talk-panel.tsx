import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { talkFor, difficultyLabel } from "@/lib/talk";
import { formatTest, rollTest, trained, type TestResult } from "@/lib/wfrp";
import { useCatalog } from "@/lib/store";
import type { Person } from "@/lib/types";

export function TalkPanel({ people }: { people: Person[] }) {
  const party = useCatalog((s) => s.party);
  const [pcId, setPcId] = useState(party[0]?.id ?? "");
  const pc = party.find((p) => p.id === pcId) || party[0];
  const [last, setLast] = useState<{ person: string; text: string; result?: TestResult } | null>(null);

  if (people.length === 0) return null;

  function run(person: Person, skill: Parameters<typeof rollTest>[1], mod: number, win: string, fail: string) {
    if (!pc) return;
    const result = rollTest(pc, skill, mod);
    setLast({
      person: person.name,
      text: result.success ? win : fail,
      result,
    });
  }

  return (
    <div className="mt-4">
      <div className="kicker text-gold">Gespräch · Wurf</div>
      <p className="mt-1 font-sans text-[12px] text-[#d8c7a4]">
        Ankunft ist frei. Würfeln erst wenn jemand redet. Alltag ohne Wurf.
      </p>
      {party.length === 0 ? (
        <p className="mt-2 text-sm">
          <Link to="/truppe" className="text-gold">Truppe anlegen</Link> — sonst kein Zielwert.
        </p>
      ) : (
        <label className="mt-2 flex items-center gap-2 font-sans text-[13px] text-[#d8c7a4]">
          Wer redet
          <select
            value={pc?.id ?? ""}
            onChange={(e) => setPcId(e.target.value)}
            className="rounded-full border border-[#6a5338] bg-[#1c140e] px-2 py-1 text-paper-2"
          >
            {party.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name || "ohne Namen"}
                {p.career ? ` · ${p.career}` : ""}
              </option>
            ))}
          </select>
        </label>
      )}

      {last ? (
        <div className="mt-3 rounded-sm border border-[#6a5338] bg-[#1c140e] p-3">
          <p className="font-sans text-[12px] text-gold">{last.person}</p>
          {last.result ? (
            <p className="mt-1 font-sans text-[13px] text-[#ead8b2]">{formatTest(last.result)}</p>
          ) : null}
          <p className="mt-2 text-[15px] leading-relaxed">{last.text}</p>
        </div>
      ) : null}

      <ul className="mt-3 space-y-4">
        {people.map((person) => (
          <li key={person.id}>
            <p className="font-serif text-lg">
              {person.name} <span className="font-sans text-[12px] text-[#d8c7a4]">{person.role}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {talkFor(person).map((t) => {
                const ok = !t.skill || (pc ? trained(pc, t.skill) : false);
                return (
                <button
                  key={t.key}
                  type="button"
                  disabled={!pc && t.skill !== null}
                  title={!ok && t.skill ? "nicht ausgebildet" : t.win}
                  onClick={() => {
                    if (!t.skill) {
                      setLast({ person: person.name, text: t.win });
                      return;
                    }
                    if (!pc) return;
                    run(person, t.skill, t.mod, t.win, t.fail);
                  }}
                  className={
                    "rounded-full border border-[#6a5338] px-2.5 py-1 font-sans text-[12px] text-paper-2 hover:border-gold disabled:opacity-40 " +
                    (!ok ? "opacity-40" : "")
                  }
                >
                  {t.label}
                  {t.skill ? ` · ${difficultyLabel(t.mod)}` : ""}
                </button>
              );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
