import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SlGate } from "@/components/sl-gate";
import { KeimeIndex } from "@/components/sl-dossier";
import { aemter } from "@/lib/amt";
import { gilde } from "@/lib/gilde";
import { catalog, slugId } from "@/lib/catalog";
import { groupedPeople, kinship, relations, stanceOf, statusOf } from "@/lib/society";
import { useCatalog } from "@/lib/store";
import type { Person } from "@/lib/types";

export const Route = createFileRoute("/leute")({
  component: () => (
    <SlGate>
      <LeutePage />
    </SlGate>
  ),
});

function emptyDraft(): Omit<Person, "id"> {
  return {
    name: "",
    age: "",
    role: "",
    house: "",
    home: "",
    work: "",
    district: "1-vorstadt",
    does: "",
    ties: [],
    named: true,
  };
}

function LeutePage() {
  const extraPeople = useCatalog((s) => s.extraPeople);
  const upsertPerson = useCatalog((s) => s.upsertPerson);
  const removePerson = useCatalog((s) => s.removePerson);
  const groups = groupedPeople(extraPeople);
  const total = groups.reduce((n, g) => n + g.rows.length, 0);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);

  function save() {
    const name = draft.name.trim();
    if (!name) return;
    const home = (draft.home ?? "").trim();
    const district =
      catalog.places.find((p) => String(p.id) === home)?.district || draft.district;
    upsertPerson({
      id: slugId(name),
      name,
      age: (draft.age ?? "").trim(),
      role: draft.role.trim() || "—",
      house: (draft.house ?? "").trim(),
      home,
      work: (draft.work ?? "").trim(),
      district,
      does: draft.does.trim(),
      ties: home ? [{ place: home, note: "Haus" }] : [],
      named: true,
    });
    setDraft(emptyDraft());
    setOpen(false);
  }

  return (
    <AppShell>
      <p className="kicker m-0">Schirm</p>
      <h1 className="mt-2 font-serif text-4xl">Leute</h1>
      <div className="folio-rule mt-4" />

      <section className="mt-4 max-w-[68ch] space-y-3 text-[17px] leading-relaxed text-ink-soft">
        <p>
          Namen stehen. Gespräch schreibst du am Ort, wenn jemand redet. Turmwächter sind Bürger
          mit Schicht, keine Geister.
        </p>
        <p>
          Trigger, Geber, Wahrheit: Skill Quest, nicht diese Seite. Keime still, bis du ziehst.
        </p>
      </section>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-6 rounded-full border border-[#5a2410] bg-accent px-4 py-2 font-sans text-[13px] text-paper-2"
      >
        {open ? "Abbrechen" : "Person anlegen"}
      </button>

      {open ? (
        <form
          className="mt-6 grid max-w-[68ch] gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <label className="block">
            <span className="kicker">Name</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-serif"
              required
            />
          </label>
          <label className="block">
            <span className="kicker">Alter</span>
            <input
              value={draft.age}
              onChange={(e) => setDraft({ ...draft, age: e.target.value })}
              className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-serif"
            />
          </label>
          <label className="block">
            <span className="kicker">Rolle</span>
            <input
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-serif"
            />
          </label>
          <label className="block">
            <span className="kicker">Haus / Familie</span>
            <input
              value={draft.house}
              onChange={(e) => setDraft({ ...draft, house: e.target.value })}
              className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-serif"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="kicker">Wohnt</span>
            <select
              value={draft.home}
              onChange={(e) => setDraft({ ...draft, home: e.target.value })}
              className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-sans text-[14px]"
            >
              <option value="">—</option>
              {catalog.places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="kicker">Tut</span>
            <textarea
              value={draft.does}
              rows={3}
              onChange={(e) => setDraft({ ...draft, does: e.target.value })}
              className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-serif leading-relaxed"
            />
          </label>
          <button
            type="submit"
            className="rounded-full border border-[#5a2410] bg-accent px-4 py-2 font-sans text-[13px] text-paper-2 sm:col-span-2"
          >
            Anlegen
          </button>
        </form>
      ) : null}

      <section id="amt" className="mt-10 scroll-mt-24">
        <p className="kicker m-0">Stadt</p>
        <h2 className="mt-1 font-serif text-2xl">Amt</h2>
        <p className="mt-3 max-w-[68ch] text-[16px] leading-relaxed text-ink-soft">
          Ein Haus trägt den Stand Amt: das Zollhaus. Der Rat ist Silber. Kein Bürgermeister.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-line-strong font-sans text-[11px] uppercase tracking-[0.12em] text-mute">
                <th className="py-2 pr-3 font-semibold">Funktion</th>
                <th className="py-2 pr-3 font-semibold">Stand</th>
                <th className="py-2 pr-3 font-semibold">Was das Heft sagt</th>
              </tr>
            </thead>
            <tbody>
              {aemter.map((a) => (
                <tr key={a.name} className="border-b border-line align-top">
                  <td className="py-2.5 pr-3">
                    <Link
                      to="/ort/$id"
                      params={{ id: a.place }}
                      className="text-ink no-underline hover:underline"
                    >
                      {a.name}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-3">{a.stand}</td>
                  <td className="py-2.5 pr-3 text-ink-soft">{a.does}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="gilde" className="mt-10 scroll-mt-24">
        <p className="kicker m-0">Markt</p>
        <h2 className="mt-1 font-serif text-2xl">Gilde</h2>
        <p className="mt-3 max-w-[68ch] text-[16px] leading-relaxed text-ink-soft">
          Sitz und Wohnung sind zwei Adressen. Keine Namen in dieser Liste, bis du sie anlegst.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-line-strong font-sans text-[11px] uppercase tracking-[0.12em] text-mute">
                <th className="py-2 pr-3 font-semibold">Ort</th>
                <th className="py-2 pr-3 font-semibold">Stand</th>
                <th className="py-2 pr-3 font-semibold">Was das Heft sagt</th>
              </tr>
            </thead>
            <tbody>
              {gilde.map((a) => (
                <tr key={a.place} className="border-b border-line align-top">
                  <td className="py-2.5 pr-3">
                    <Link
                      to="/ort/$id"
                      params={{ id: a.place }}
                      className="text-ink no-underline hover:underline"
                    >
                      {a.name}
                    </Link>
                  </td>
                  <td className="py-2.5 pr-3">{a.stand}</td>
                  <td className="py-2.5 pr-3 text-ink-soft">{a.does}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <KeimeIndex />

      <section className="mt-10">
        <p className="kicker m-0">Spiel</p>
        <h2 className="mt-1 font-serif text-2xl">{total ? `${total} Namen` : "Noch niemand"}</h2>
        {total === 0 ? (
          <p className="mt-3 max-w-[58ch] text-ink-soft">
            Die Tabelle ist leer. Anlegen, Haus wählen, am Ort das Gespräch schreiben.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-line-strong font-sans text-[11px] uppercase tracking-[0.12em] text-mute">
                  <th className="py-2 pr-3 font-semibold">Name</th>
                  <th className="py-2 pr-3 font-semibold">Haus</th>
                  <th className="py-2 pr-3 font-semibold">Stand</th>
                  <th className="py-2 pr-3 font-semibold">Haltung</th>
                  <th className="py-2 pr-3 font-semibold">Rolle</th>
                  <th className="py-2 pr-3 font-semibold">Verwandtschaft</th>
                  <th className="py-2 pr-3 font-semibold">Beziehungen</th>
                  <th className="py-2 pr-3 font-semibold" />
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <Fragment key={g.stand}>
                    <tr>
                      <td
                        colSpan={8}
                        className="bg-[#ead8b2]/50 pb-1 pt-5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-mute"
                      >
                        {g.stand} · {g.rows.length}
                      </td>
                    </tr>
                    {g.rows.map((p) => (
                      <tr key={p.id} className="border-b border-line align-top">
                        <td className="py-2.5 pr-3">
                          {p.home ? (
                            <Link
                              to="/ort/$id"
                              params={{ id: p.home }}
                              className="text-ink no-underline hover:underline"
                            >
                              {p.name}
                            </Link>
                          ) : (
                            p.name
                          )}
                          {p.age ? <span className="text-mute"> · {p.age}</span> : null}
                        </td>
                        <td className="py-2.5 pr-3">{p.house || "—"}</td>
                        <td className="py-2.5 pr-3">{statusOf(p)}</td>
                        <td className="py-2.5 pr-3">{stanceOf(p)}</td>
                        <td className="py-2.5 pr-3">{p.role}</td>
                        <td className="py-2.5 pr-3 text-ink-soft">{kinship(p, extraPeople)}</td>
                        <td className="py-2.5 pr-3 text-ink-soft">{relations(p, extraPeople)}</td>
                        <td className="py-2.5">
                          <button
                            type="button"
                            className="font-sans text-[13px] text-mute"
                            onClick={() => removePerson(p.id)}
                          >
                            weg
                          </button>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
