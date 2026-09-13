import { Link } from "@tanstack/react-router";
import { amtAt } from "@/lib/amt";
import { gildeAt } from "@/lib/gilde";
import { keimAt, keime, keimeInDistrict } from "@/lib/keime";
import { useCatalog } from "@/lib/store";

export function KeimCard({ placeId }: { placeId: string }) {
  const keim = keimAt(placeId);
  const open = useCatalog((s) => s.keimOpen[placeId] === true);
  const setKeimOpen = useCatalog((s) => s.setKeimOpen);
  if (!keim) return null;
  return (
    <div className="mt-4">
      <div className="kicker text-gold">Keim {keim.n} · {open ? "gezogen" : "still"}</div>
      <p className="mt-1 font-serif text-lg text-paper-2">{keim.street}</p>
      <p className="mt-1 text-sm leading-relaxed text-paper-2">{open ? keim.pull : keim.still}</p>
      <button
        type="button"
        onClick={() => setKeimOpen(placeId, !open)}
        className="mt-2 font-sans text-[13px] text-gold"
      >
        {open ? "Wieder still legen" : "Keim ziehen"}
      </button>
      <Link
        to="/leute"
        hash="keime"
        className="ml-3 font-sans text-[13px] text-gold no-underline hover:underline"
      >
        alle drei
      </Link>
    </div>
  );
}

export function SlDossier({ placeId }: { placeId: string }) {
  const guild = gildeAt(placeId);
  const offices = amtAt(placeId).filter((a) => !guild.some((g) => g.place === a.place && g.name === a.name));
  if (guild.length === 0 && offices.length === 0) return null;

  return (
    <div className="mt-4 space-y-4">
      {offices.map((a) => (
        <div key={`amt-${a.place}-${a.name}`}>
          <div className="kicker text-gold">Amt</div>
          <p className="mt-1 font-serif text-lg text-paper-2">{a.name}</p>
          {a.who ? <p className="text-sm text-[#d8c7a4]">{a.who}</p> : null}
          <p className="mt-1 text-sm leading-relaxed text-paper-2">{a.does}</p>
          {a.place !== placeId ? (
            <Link
              to="/ort/$id"
              params={{ id: a.place }}
              className="mt-1 inline-block font-sans text-[13px] text-gold no-underline hover:underline"
            >
              zum Amtshaus
            </Link>
          ) : (
            <Link to="/leute" hash="amt" className="mt-1 inline-block font-sans text-[13px] text-gold no-underline hover:underline">
              alle Ämter
            </Link>
          )}
        </div>
      ))}
      {guild.map((a) => (
        <div key={`gilde-${a.place}-${a.name}`}>
          <div className="kicker text-gold">Gilde</div>
          <p className="mt-1 font-serif text-lg text-paper-2">{a.name}</p>
          {a.who ? <p className="text-sm text-[#d8c7a4]">{a.who}</p> : null}
          <p className="mt-1 text-sm leading-relaxed text-paper-2">{a.does}</p>
          {a.place !== placeId ? (
            <Link
              to="/ort/$id"
              params={{ id: a.place }}
              className="mt-1 inline-block font-sans text-[13px] text-gold no-underline hover:underline"
            >
              zum Gildehaus
            </Link>
          ) : (
            <Link to="/leute" hash="gilde" className="mt-1 inline-block font-sans text-[13px] text-gold no-underline hover:underline">
              Gilde und Zunft
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

function KeimStrip({ district }: { district: string }) {
  const list = keimeInDistrict(district);
  const keimOpen = useCatalog((s) => s.keimOpen);
  if (list.length === 0) return null;
  return (
    <section className="box-gm mt-6">
      <div className="kicker text-gold">Schirm · Keime</div>
      <ul className="mt-2 space-y-2 text-sm leading-relaxed text-paper-2">
        {list.map((k) => (
          <li key={k.place}>
            <Link
              to="/ort/$id"
              params={{ id: k.place }}
              className="text-gold no-underline hover:underline"
            >
              Keim {k.n} · {k.street}
            </Link>
            {keimOpen[k.place] ? " · gezogen" : " · still"}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function DistrictDossier({ district }: { district: string }) {
  return (
    <>
      {district === "3-markt" ? (
        <section className="box-gm mt-6">
          <div className="kicker text-gold">Schirm · Gilde</div>
          <p className="mt-2 text-sm leading-relaxed text-paper-2">
            Zwei Körper, eine Gasse. Kaufmannsgilde setzt Preise und Namen (Marktplatz 1). Holtz schläft
            Gildengasse 2. Handwerkerzunft hält Korn und Briefe. Voss ist die andere Familie. Siegel bei
            Feder, nicht bei Holtz.
          </p>
          <Link to="/leute" hash="gilde" className="mt-2 inline-block font-sans text-[13px] text-gold no-underline hover:underline">
            Gilde und Zunft
          </Link>
        </section>
      ) : null}
      {district === "2-tor" ? (
        <section className="box-gm mt-6">
          <div className="kicker text-gold">Schirm · Amt</div>
          <p className="mt-2 text-sm leading-relaxed text-paper-2">
            Ein Haus trägt den Stand Amt: Zollhaus, Torstraße 1, Arne Helm. Nordtor ist dieselbe Schwelle,
            kein zweites Amt. Wache wohnt Torstraße 8. Macht klein und nah. Kein Kerkerpalast.
          </p>
          <Link to="/leute" hash="amt" className="mt-2 inline-block font-sans text-[13px] text-gold no-underline hover:underline">
            alle Ämter
          </Link>
        </section>
      ) : null}
      {district === "1-vorstadt" ? (
        <section className="box-gm mt-6">
          <div className="kicker text-gold">Schirm · Amt</div>
          <p className="mt-2 text-sm leading-relaxed text-paper-2">
            Kein Zoll hier. Steuermann der Vorstadt in der getünchten Hütte — unbenannt, nicht Helm.
            Laus sitzt vor der Mauer, vor dem Amt.
          </p>
        </section>
      ) : null}
      {district === "5-morr" ? (
        <section className="box-gm mt-6">
          <div className="kicker text-gold">Schirm · Amt</div>
          <p className="mt-2 text-sm leading-relaxed text-paper-2">
            Morr ist Dienst, nicht Stadtamt. Miren in der Kapelle, Silas am Osttor. Die Wache steht hier
            ungern.
          </p>
        </section>
      ) : null}
      <KeimStrip district={district} />
    </>
  );
}

export function KeimeIndex() {
  const keimOpen = useCatalog((s) => s.keimOpen);
  const setKeimOpen = useCatalog((s) => s.setKeimOpen);
  return (
    <section id="keime" className="mt-10 scroll-mt-24">
      <p className="kicker m-0">Still</p>
      <h2 className="mt-1 font-serif text-2xl">Drei Keime</h2>
      <p className="mt-3 max-w-[68ch] text-[16px] leading-relaxed text-ink-soft">
        Still, bis der SL zieht. Rattenwinkel 2, Bettelgasse 3, Marktplatz 10. Kein Spawn, keine
        Engine. Wer zieht, öffnet eine Szene.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-line-strong font-sans text-[11px] uppercase tracking-[0.12em] text-mute">
              <th className="py-2 pr-3 font-semibold">Keim</th>
              <th className="py-2 pr-3 font-semibold">Ort</th>
              <th className="py-2 pr-3 font-semibold">Still</th>
              <th className="py-2 pr-3 font-semibold">Wenn gezogen</th>
              <th className="py-2 pr-3 font-semibold">Lage</th>
            </tr>
          </thead>
          <tbody>
            {keime.map((k) => {
              const open = keimOpen[k.place] === true;
              return (
                <tr key={k.place} className="border-b border-line align-top">
                  <td className="py-2.5 pr-3">{k.n}</td>
                  <td className="py-2.5 pr-3">
                    <Link
                      to="/ort/$id"
                      params={{ id: k.place }}
                      className="text-ink no-underline hover:underline"
                    >
                      {k.street}
                    </Link>
                    <div className="text-mute">{k.name}</div>
                  </td>
                  <td className="py-2.5 pr-3 text-ink-soft">{k.still}</td>
                  <td className="py-2.5 pr-3 text-ink-soft">{k.pull}</td>
                  <td className="py-2.5 pr-3">
                    <button
                      type="button"
                      onClick={() => setKeimOpen(k.place, !open)}
                      className="font-sans text-[13px] text-accent"
                    >
                      {open ? "gezogen" : "still"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
