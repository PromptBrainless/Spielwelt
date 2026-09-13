import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceCard } from "@/components/place-card";
import { PlaceImage } from "@/components/place-image";
import { catalog, coverSrc, placesInDistrict, allPlaces, searchBlob } from "@/lib/catalog";
import { hasTischPlay } from "@/lib/sicht";
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
  const sicht = useCatalog((s) => s.sicht);
  const sl = sicht === "sl";
  const query = (q || "").trim().toLowerCase();

  const hits = query
    ? allPlaces(customPlaces)
        .map((p) => mergePlace(p, patches))
        .filter((p) => searchBlob(p, sl).includes(query))
    : [];

  const playCount = allPlaces(customPlaces)
    .map((p) => mergePlace(p, patches))
    .filter(hasTischPlay).length;

  const pageHits =
    query && sl
      ? extraPages.filter((p) => `${p.title} ${p.body}`.toLowerCase().includes(query))
      : [];

  return (
    <AppShell>
      <section>
        <p className="kicker m-0">Marktflecken im Reikland</p>
        <h1 className="mt-2 font-serif text-[44px] leading-tight tracking-tight">Drosselau</h1>
        <div className="folio-rule mt-4" />
        <p className="mt-4 max-w-[54ch] text-[19px] leading-relaxed text-ink-soft">
          Etwa achthundert Seelen. Anno {catalog.year.replace(/\s*IZ\.?$/i, "")}.
        </p>
        {sl ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-pine/40 bg-card px-2.5 py-0.5 font-sans text-xs text-pine">
              69 Kernorte
            </span>
            <span className="rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft">
              {allPlaces(customPlaces).length} Ansichten
            </span>
            <span className="rounded-full border border-accent/40 bg-[#f6ece4] px-2.5 py-0.5 font-sans text-xs text-accent">
              {playCount} spielbereit
            </span>
            <span className="rounded-full border border-keim/40 bg-[#f6e6ec] px-2.5 py-0.5 font-sans text-xs text-keim">
              3 stille Keime
            </span>
          </div>
        ) : null}
      </section>

      {query ? (
        <section className="mt-10">
          <h2 className="font-serif text-2xl">{q}</h2>
          <p className="text-mute">{hits.length + pageHits.length} Treffer</p>
          {pageHits.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {pageHits.map((p) => (
                <li key={p.id}>
                  <Link to="/seite/$id" params={{ id: p.id }} className="text-accent hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hits.map((p) => (
              <PlaceCard key={p.id} place={p} />
            ))}
          </div>
        </section>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.districts.map((d) => {
            const list = placesInDistrict(d.key, customPlaces).map((p) => mergePlace(p, patches));
            const ready = list.filter(hasTischPlay).length;
            return (
              <Link
                key={d.key}
                to="/bezirk/$key"
                params={{ key: d.key }}
                className="card-lift text-ink no-underline"
              >
                <div className="plate">
                <PlaceImage
                  id={d.cover}
                  fallback={coverSrc(d)}
                  alt={d.name}
                  local={false}
                  className="h-40 w-full object-cover"
                />
                <div className="px-1.5 pb-1.5 pt-3">
                  {sl ? (
                    <div className="font-sans text-xs text-mute">
                      {list.length} Ansichten{ready ? ` · ${ready} spielbereit` : ""}
                    </div>
                  ) : null}
                  <strong className="text-lg">{districtPatches[d.key]?.name || d.name}</strong>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {districtPatches[d.key]?.intro || d.intro}
                  </p>
                </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {sl ? (
        <p className="mt-10 rounded-lg border border-line bg-card/80 p-4 text-ink-soft">
          Neues Material kommt über Arbeit · Eingang in den Katalog.
        </p>
      ) : null}
    </AppShell>
  );
}
