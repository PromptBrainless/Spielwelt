import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { SlGate } from "@/components/sl-gate";
import { catalog, hasPlay, placeById, placesInDistrict } from "@/lib/catalog";
import { mergePlace, useCatalog } from "@/lib/store";

export const Route = createFileRoute("/werkstatt")({
  component: () => (
    <SlGate>
      <WerkstattPage />
    </SlGate>
  ),
});

type Dossier = {
  name: string;
  district: string;
  role: string;
  voice: string;
  motive: string;
  secret: string;
  hook: string;
  pressure: string;
  place: string;
  placeId: string;
};

const firstNames = [
  "Alrik",
  "Elsa",
  "Hannes",
  "Marta",
  "Jaan",
  "Sigrid",
  "Konrad",
  "Liesel",
  "Otto",
  "Brunhilde",
  "Willi",
  "Greta",
];
const familyNames = [
  "Karr",
  "Moos",
  "Holtz",
  "Hesse",
  "Bode",
  "Wurzel",
  "Eckert",
  "Staub",
  "Karg",
  "Unken",
  "Dünn",
  "Leder",
];
const roles = [
  "Zollschreiber",
  "Tagelöhnerin",
  "Gildengehilfe",
  "Gesellin der Schmiede",
  "Wäscherin",
  "Fuhrmann",
  "Krämer",
  "Totengräbergehilfe",
  "Bettler mit gutem Gedächtnis",
  "Wirtshausgast",
  "Färberlehrling",
  "Wache außer Dienst",
];
const voices = [
  "spricht leise und zählt dabei Münzen mit dem Daumen",
  "beantwortet jede Frage mit einer Gegenfrage",
  "lacht zu früh, wenn jemand von den Toten spricht",
  "hält die linke Hand ständig über eine alte Narbe",
  "wechselt zwischen höflicher Förmlichkeit und blanker Erschöpfung",
  "kennt jeden Weg, aber nie den richtigen Namen dazu",
  "redet über das Wetter, sobald eine Schuld zur Sprache kommt",
  "sieht den Gesprächspartner selten direkt an",
];
const motives = [
  "will die ausstehende Schuld der Familie tilgen",
  "möchte Drosselau verlassen, bevor der nächste Winter kommt",
  "will beweisen, dass die Gilde nicht unantastbar ist",
  "sucht eine verschwundene Person, ohne die Wache einzuschalten",
  "braucht Schutz für jemanden, den sie öffentlich verleugnet",
  "will aus einem Gerücht einen bezahlten Vorteil machen",
  "versucht, einen alten Fehler vor Morrs Garten geheim zu halten",
  "möchte endlich als ehrlicher Mensch gelten",
];
const secrets = [
  "hat einen Schlüssel, der zu keinem sichtbaren Schloss im Bezirk passt",
  "hat eine Lieferung umgeleitet und die Quittung behalten",
  "war in der Nacht am offenen Portal, obwohl sie es bestreitet",
  "kennt den wahren Besitzer eines verlassenen Hauses",
  "hat eine Münze mit abgeschliffenem Gepräge erhalten",
  "hat einen Namen aus dem Gildenarchiv entfernt",
  "hat etwas im Mistplatz gefunden, das nicht weggeworfen wurde",
  "ist überzeugt, dass ein harmloses Zeichen auf der Tür beobachtet wird",
];
const hooks = [
  "bittet die Gruppe, eine Nachricht zu überbringen, ohne den Namen des Empfängers zu nennen",
  "bietet eine Unterkunft an, verlangt dafür aber eine unbequeme Wahrheit",
  "führt die Gruppe zu einem Ort, an dem eine Spur im Regen verschwindet",
  "behauptet, dass ein offizielles Siegel falsch ist",
  "kennt ein Opfer und den Verdächtigen, verwechselt aber absichtlich beide Namen",
  "hat einen Auftrag, der harmlos beginnt und am Pranger endet",
];
const pressures = [
  "Die Wache stellt in zwei Stunden Fragen.",
  "Der Regen macht die sichtbare Spur bis Sonnenaufgang unbrauchbar.",
  "Eine dritte Partei hört im Nebenzimmer mit.",
  "Die Person schuldet jemandem aus dem Schattenbezirk Geld.",
  "Morrs Garten schließt nicht, aber die Tore werden gezählt.",
  "Ein Auftraggeber zahlt nur, wenn niemand Gewalt angewendet hat.",
];

function pick<T>(items: T[], seed: number) {
  return items[Math.abs(seed) % items.length];
}

function buildDossier(seed: number, districtKey: string): Dossier {
  const district = catalog.districts.find((d) => d.key === districtKey) ?? catalog.districts[0];
  const places = placesInDistrict(district.key, []).filter((p) => p.name);
  const place = places[Math.abs(seed * 7) % Math.max(places.length, 1)];
  return {
    name: `${pick(firstNames, seed)} ${pick(familyNames, seed + 3)}`,
    district: district.name,
    role: pick(roles, seed + 5),
    voice: pick(voices, seed + 7),
    motive: pick(motives, seed + 11),
    secret: pick(secrets, seed + 13),
    hook: pick(hooks, seed + 17),
    pressure: pick(pressures, seed + 19),
    place: place?.name ?? "eine namenlose Ecke des Bezirks",
    placeId: String(place?.id ?? ""),
  };
}

function WerkstattPage() {
  const patches = useCatalog((s) => s.patches);
  const customPlaces = useCatalog((s) => s.customPlaces);
  const [districtKey, setDistrictKey] = useState(catalog.districts[0]?.key ?? "1-vorstadt");
  const [seed, setSeed] = useState(() => Math.floor(Date.now() / 1000));
  const [saved, setSaved] = useState<Dossier[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const dossier = useMemo(() => buildDossier(seed, districtKey), [seed, districtKey]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("drosselau.dossiers.v1");
      if (raw) setSaved(JSON.parse(raw) as Dossier[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("drosselau.dossiers.v1", JSON.stringify(saved.slice(0, 12)));
    } catch {
      /* ignore */
    }
  }, [saved, hydrated]);

  const packs = [...catalog.queue].sort((a, b) => {
    const score = (pack: (typeof catalog.queue)[number]) =>
      pack.ids.filter((id) => {
        const p = placeById(id, customPlaces);
        return p ? hasPlay(mergePlace(p, patches)) : false;
      }).length;
    return score(b) - score(a) || a.pack - b.pack;
  });

  const ready = packs.filter((pack) =>
    pack.ids.some((id) => {
      const p = placeById(id, customPlaces);
      return p ? hasPlay(mergePlace(p, patches)) : false;
    }),
  );

  return (
    <AppShell>
      <section className="max-w-[88ch]">
        <div className="font-sans text-xs uppercase tracking-[0.16em] text-mute">Tisch · Packs · Personen</div>
        <h1 className="mt-1 font-serif text-4xl">Werkstatt</h1>
        <p className="mt-3 max-w-[68ch] text-[18px] leading-relaxed text-ink-soft">
          Spielschichten liegen auf dem Kanon, sie ersetzen ihn nicht. Pack 1 bis 3 sind schreibbereit.
          Darunter: eine Person, die in diesem Bezirk wirklich stehen kann.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Packs</h2>
        <ul className="mt-4 space-y-2">
          {packs.map((pack) => {
            const places = pack.ids
              .map((id) => placeById(id, customPlaces))
              .flatMap((p) => (p ? [mergePlace(p, patches)] : []));
            const n = places.filter(hasPlay).length;
            return (
              <li
                key={pack.pack}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-[18px] border border-line bg-card px-4 py-3"
              >
                <div>
                  <strong>Pack {pack.pack}</strong>
                  <span className="text-ink-soft">
                    {" "}
                    · {places.map((p) => p.name.split("·")[0].trim()).join(" · ")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {places.map((p) => (
                    <Link
                      key={p.id}
                      to="/ort/$id"
                      params={{ id: String(p.id) }}
                      className="font-sans text-[13px] text-accent no-underline hover:underline"
                    >
                      {p.id}
                    </Link>
                  ))}
                  <span
                    className={
                      n === pack.ids.length
                        ? "rounded-full border border-pine/40 bg-card px-2.5 py-0.5 font-sans text-xs text-pine"
                        : "rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-mute"
                    }
                  >
                    {n}/{pack.ids.length} spielbereit
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 font-sans text-sm text-mute">
          {ready.length} Packs mit Spielschicht · Kanonfelder bleiben die Quelle.
        </p>
      </section>

      <section className="mt-12 max-w-[88ch]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Person würfeln</h2>
            <p className="mt-2 max-w-[62ch] text-ink-soft">
              Nebenfigur mit Druck, Geheimnis und einem echten Ort. Keine Werte, kein Adel aus dem Nichts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSeed((value) => value + 1 + Math.floor(Math.random() * 97))}
            className="rounded-full border border-[#5a2410] bg-accent px-4 py-2 font-sans text-sm text-paper-2"
          >
            Neue Person
          </button>
        </div>
        <label className="mt-4 block font-sans text-xs uppercase tracking-wider text-mute">
          Bezirk
          <select
            value={districtKey}
            onChange={(e) => setDistrictKey(e.target.value)}
            className="mt-1 block w-full max-w-sm rounded-[14px] border border-line bg-card px-3 py-2 font-serif text-[16px] text-ink"
          >
            {catalog.districts.map((d) => (
              <option key={d.key} value={d.key}>
                {d.num} · {d.name}
              </option>
            ))}
          </select>
        </label>
        <article className="mt-5 rounded-[22px] border border-line bg-card p-5">
          <h3 className="font-serif text-3xl">{dossier.name}</h3>
          <p className="mt-1 text-ink-soft">
            {dossier.role} · {dossier.district}
          </p>
          <dl className="mt-4 grid gap-3">
            <div>
              <dt className="font-sans text-xs uppercase tracking-wider text-mute">Stimme</dt>
              <dd>{dossier.voice}</dd>
            </div>
            <div>
              <dt className="font-sans text-xs uppercase tracking-wider text-mute">Motiv</dt>
              <dd>{dossier.motive}</dd>
            </div>
            <div>
              <dt className="font-sans text-xs uppercase tracking-wider text-mute">Geheimnis</dt>
              <dd>{dossier.secret}</dd>
            </div>
            <div>
              <dt className="font-sans text-xs uppercase tracking-wider text-mute">Aufhänger</dt>
              <dd>{dossier.hook}</dd>
            </div>
            <div>
              <dt className="font-sans text-xs uppercase tracking-wider text-mute">Druck</dt>
              <dd>{dossier.pressure}</dd>
            </div>
            <div>
              <dt className="font-sans text-xs uppercase tracking-wider text-mute">Ort</dt>
              <dd>
                {dossier.placeId ? (
                  <Link to="/ort/$id" params={{ id: dossier.placeId }} className="text-accent no-underline hover:underline">
                    {dossier.place}
                  </Link>
                ) : (
                  dossier.place
                )}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={() =>
              setSaved((list) => [dossier, ...list.filter((d) => d.name !== dossier.name)].slice(0, 8))
            }
            className="mt-5 rounded-full border border-line-strong bg-paper px-4 py-2 font-sans text-sm"
          >
            Dossier behalten
          </button>
        </article>
        {saved.length ? (
          <ul className="mt-6 space-y-2">
            {saved.map((d) => (
              <li key={d.name + d.place} className="rounded-[14px] border border-line bg-card px-4 py-2">
                <strong>{d.name}</strong>
                <span className="text-ink-soft">
                  {" "}
                  · {d.role} · {d.place}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </AppShell>
  );
}
