import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceImage } from "@/components/place-image";
import { PlacePills } from "@/components/pills";
import { districtByKey, photoSrc, placesInDistrict } from "@/lib/catalog";
import { mergePlace, useCatalog } from "@/lib/store";

export const Route = createFileRoute("/bezirk/$key")({
  component: BezirkPage,
});

function BezirkPage() {
  const { key } = Route.useParams();
  const d = districtByKey(key);
  const patches = useCatalog((s) => s.patches);
  const customPlaces = useCatalog((s) => s.customPlaces);
  const districtPatches = useCatalog((s) => s.districtPatches);
  const hideSl = useCatalog((s) => s.hideSl);
  const list = placesInDistrict(key, customPlaces).map((p) => mergePlace(p, patches));

  if (!d) {
    return (
      <AppShell>
        <p>Bezirk nicht gefunden.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <p className="m-0 font-sans text-xs uppercase tracking-[0.14em] text-mute">
        {d.num} · Bezirk
      </p>
      <h1 className="mt-1 font-serif text-4xl">{d.name}</h1>
      <p className="max-w-[62ch] text-[18px] text-ink-soft">
        {districtPatches[d.key]?.intro || d.intro}
      </p>
      <p className="text-sm text-mute">{districtPatches[d.key]?.fabric || d.fabric}</p>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <article key={p.id} className="overflow-hidden rounded-[22px] border border-line bg-card">
            <Link to="/ort/$id" params={{ id: p.id }} className="block text-ink no-underline">
              <PlaceImage
                id={p.id}
                fallback={photoSrc(p)}
                alt={p.name}
                className="h-44 w-full object-cover"
              />
              <div className="p-3">
                <div className="font-sans text-xs text-mute">{p.id}</div>
                <h3 className="m-0 text-lg">{p.name}</h3>
                <div className="mt-2">
                  <PlacePills place={p} />
                </div>
                <p className="mt-2 text-sm text-ink-soft">
                  {hideSl ? p.sieht : p.am_tisch}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
