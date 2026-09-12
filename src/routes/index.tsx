import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceImage } from "@/components/place-image";
import { PlacePills } from "@/components/pills";
import { catalog, coverSrc, photoSrc, placesInDistrict, allPlaces } from "@/lib/catalog";
import { mergePlace, useCatalog } from "@/lib/store";

type Search = { q?: string };

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: Home,
});

function Home() {
  const { q } = Route.useSearch();
  const patches = useCatalog((s) => s.patches);
  const customPlaces = useCatalog((s) => s.customPlaces);
  const extraPages = useCatalog((s) => s.extraPages);
  const districtPatches = useCatalog((s) => s.districtPatches);
  const hideSl = useCatalog((s) => s.hideSl);
  const query = (q || "").trim().toLowerCase();

  const hits = query
    ? allPlaces(customPlaces)
        .map((p) => mergePlace(p, patches))
        .filter((p) => {
          const hay = [
            p.name,
            p.kanon,
            p.sieht,
            p.wer,
            p.geruecht,
            p.sl,
            p.am_tisch,
            p.typ,
            p.bezirk,
          ]
            .join(" ")
            .toLowerCase();
          return hay.includes(query);
        })
    : [];

  const pageHits = query
    ? extraPages.filter((p) => `${p.title} ${p.body}`.toLowerCase().includes(query))
    : [];

  return (
    <AppShell>
      <section>
        <h1 className="m-0 font-serif text-[42px] leading-tight tracking-tight">Drosselau</h1>
        <p className="mt-2 max-w-[62ch] text-[19px] leading-relaxed text-ink-soft">
          Ortskatalog · {catalog.count + customPlaces.length} Einträge · Anno {catalog.year}. Marktflecken im Reikland, etwa
          achthundert Seelen. Grok kennt den Heftstil und bearbeitet Ortsschilder, ohne Bogen und Banner
          zu zerlegen.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-pine/40 bg-card px-2.5 py-0.5 font-sans text-xs text-pine">
            69 Kernorte
          </span>
          <span className="rounded-full border border-gold/50 bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft">
            Erweiterung Fotoheft
          </span>
          <span className="rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft">
            118 Ansichten
          </span>
          <span className="rounded-full border border-keim/40 bg-[#f6e6ec] px-2.5 py-0.5 font-sans text-xs text-keim">
            3 stille Keime
          </span>
        </div>
      </section>

      {query ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">Suche: {q}</h2>
          <p className="text-mute">{hits.length + pageHits.length} Treffer</p>
          {pageHits.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {pageHits.map((p) => (
                <li key={p.id}>
                  <Link to="/seite/$id" params={{ id: p.id }} className="text-accent hover:underline">
                    SL-Seite · {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hits.map((p) => (
              <Link
                key={p.id}
                to="/ort/$id"
                params={{ id: p.id }}
                className="overflow-hidden rounded-[22px] border border-line bg-card text-ink no-underline"
              >
                <PlaceImage
                  id={p.id}
                  fallback={photoSrc(p)}
                  alt={p.name}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <div className="font-sans text-xs text-mute">{p.id}</div>
                  <h3 className="m-0 text-lg">{p.name}</h3>
                  <div className="mt-2">
                    <PlacePills place={p} />
                  </div>
                  {!hideSl ? (
                    <p className="mt-2 text-sm text-ink-soft">{p.am_tisch}</p>
                  ) : (
                    <p className="mt-2 text-sm text-ink-soft">{p.sieht}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.districts.map((d) => (
            <Link
              key={d.key}
              to="/bezirk/$key"
              params={{ key: d.key }}
              className="overflow-hidden rounded-[22px] border border-line bg-card text-ink no-underline"
            >
              <PlaceImage
                id={d.cover}
                fallback={coverSrc(d)}
                alt={d.name}
                local={false}
                className="h-40 w-full object-cover"
              />
              <div className="p-3">
                <div className="font-sans text-xs text-mute">
                  {placesInDistrict(d.key, customPlaces).length} Ansichten
                </div>
                <strong className="text-lg">
                  {d.num} · {d.name}
                </strong>
                <p className="mt-1 text-sm text-ink-soft">
                  {districtPatches[d.key]?.intro || d.intro}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-10 rounded-[22px] border border-line bg-card/80 p-4 text-ink-soft">
        <strong className="text-ink">Eingang für neues Material.</strong> Texte, SL-Notizen und Bilder
        schickst du unter Eingang direkt in den Katalog — auf einen bestehenden Ort, einen Bezirk oder eine
        neue Seite. Bildaufträge an Grok ersetzen nur das lokale Schild.
      </p>
    </AppShell>
  );
}
