import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PlaceCard } from "@/components/place-card";
import { DistrictDossier } from "@/components/sl-dossier";
import { districtByKey, placesInDistrict } from "@/lib/catalog";
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
  const sl = useCatalog((s) => s.sicht) === "sl";
  const list = placesInDistrict(key, customPlaces).map((p) => mergePlace(p, patches));

  if (!d) {
    return (
      <AppShell>
        <p>Dieser Bezirk fehlt im Katalog.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {sl ? (
        <p className="kicker m-0">
          {d.num} · Bezirk
        </p>
      ) : (
        <p className="kicker m-0">Drosselau</p>
      )}
      <h1 className="mt-2 font-serif text-4xl tracking-tight">
        {districtPatches[d.key]?.name || d.name}
      </h1>
      <div className="folio-rule mt-4" />
      <p className="mt-3 max-w-[62ch] text-[18px] leading-relaxed text-ink-soft">
        {districtPatches[d.key]?.intro || d.intro}
      </p>
      {sl ? (
        <p className="text-sm text-mute">{districtPatches[d.key]?.fabric || d.fabric}</p>
      ) : null}
      {sl ? <DistrictDossier district={d.key} /> : null}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
      </div>
    </AppShell>
  );
}
