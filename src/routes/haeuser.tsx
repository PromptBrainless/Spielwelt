import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SlGate } from "@/components/sl-gate";
import { catalog, allPlaces } from "@/lib/catalog";
import { mergePlace, useCatalog } from "@/lib/store";

export const Route = createFileRoute("/haeuser")({
  component: () => (
    <SlGate>
      <HaeuserPage />
    </SlGate>
  ),
});

function HaeuserPage() {
  const patches = useCatalog((s) => s.patches);
  const customPlaces = useCatalog((s) => s.customPlaces);
  const patchPlace = useCatalog((s) => s.patchPlace);
  const places = allPlaces(customPlaces).map((p) => mergePlace(p, patches));
  const hausN = places.filter((p) => (p.haus || "").trim()).length;
  const famN = places.filter((p) => (p.familie || "").trim()).length;

  return (
    <AppShell>
      <p className="kicker m-0">Schirm</p>
      <h1 className="mt-2 font-serif text-4xl">Häuser</h1>
      <div className="folio-rule mt-4" />
      <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-ink-soft">
        Haus und Familie gelten. Alte Platzhalternamen sind weg.
      </p>
      <p className="mt-2 font-sans text-[13px] text-mute">
        Haus {hausN} / {places.length} · Familie {famN} / {places.length}
      </p>

      <nav className="mt-6 flex flex-wrap gap-2">
        {catalog.districts.map((d) => (
          <a
            key={d.key}
            href={`#${d.key}`}
            className="rounded-full border border-line-strong px-3 py-1.5 font-sans text-[13px] text-ink no-underline"
          >
            {d.short}
          </a>
        ))}
      </nav>

      {catalog.districts.map((d) => {
        const rows = places.filter((p) => p.district === d.key);
        const done = rows.filter((p) => (p.haus || "").trim() && (p.familie || "").trim()).length;
        return (
          <section key={d.key} id={d.key} className="mt-10 scroll-mt-24">
            <p className="kicker m-0">{d.num}</p>
            <h2 className="mt-1 font-serif text-2xl">{d.name}</h2>
            <p className="mt-1 font-sans text-[13px] text-mute">
              {rows.length} Häuser · {done} mit Haus und Familie
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-left text-[14px]">
                <thead>
                  <tr className="border-b border-line-strong font-sans text-[11px] uppercase tracking-[0.12em] text-mute">
                    <th className="py-2 pr-3 font-semibold">ID</th>
                    <th className="py-2 pr-3 font-semibold">Haus</th>
                    <th className="py-2 pr-3 font-semibold">Familie</th>
                    <th className="py-2 pr-3 font-semibold">Typ</th>
                    <th className="py-2 pr-3 font-semibold">Stand</th>
                    <th className="py-2 pr-3 font-semibold">Kanon</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id} className="border-b border-line align-top">
                      <td className="py-2 pr-3 font-sans tabular-nums text-mute">
                        <Link
                          to="/ort/$id"
                          params={{ id: String(p.id) }}
                          className="text-accent no-underline hover:underline"
                        >
                          {p.id}
                        </Link>
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          value={p.haus ?? ""}
                          onChange={(e) => patchPlace(p.id, { haus: e.target.value })}
                          className="w-full min-w-[10rem] rounded-sm border border-line bg-card px-2 py-1.5 font-serif"
                          aria-label={`Haus ${p.id}`}
                        />
                      </td>
                      <td className="py-2 pr-3">
                        <input
                          value={p.familie ?? ""}
                          onChange={(e) => patchPlace(p.id, { familie: e.target.value })}
                          className="w-full min-w-[8rem] rounded-sm border border-line bg-card px-2 py-1.5 font-serif"
                          aria-label={`Familie ${p.id}`}
                        />
                      </td>
                      <td className="py-2 pr-3 text-ink-soft">{p.typ || "—"}</td>
                      <td className="py-2 pr-3">{p.stand || "—"}</td>
                      <td className="py-2 pr-3 text-ink-soft">{p.kanon || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </AppShell>
  );
}
