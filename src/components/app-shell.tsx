import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { catalog, placesInDistrict } from "@/lib/catalog";
import { useCatalog } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const sicht = useCatalog((s) => s.sicht);
  const setSicht = useCatalog((s) => s.setSicht);
  const resetCanon = useCatalog((s) => s.resetCanon);
  const customPlaces = useCatalog((s) => s.customPlaces);
  const extraPages = useCatalog((s) => s.extraPages);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const [q, setQ] = useState("");
  const sl = sicht === "sl";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const found = /(?:\?|&)q=([^&]*)/.exec(searchStr || "");
    if (found) setQ(decodeURIComponent(found[1].replace(/\+/g, " ")));
  }, [searchStr]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (!t) return;
    navigate({ to: "/", search: { q: t } });
  }

  return (
    <div className="min-h-dvh" data-sicht={sicht}>
      <header
        className={
          sl
            ? "sticky top-0 z-20 flex flex-wrap items-center gap-3 bg-bar/95 px-4 py-2.5 text-paper-2 backdrop-blur-md"
            : "sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-line bg-paper-2/90 px-4 py-2.5 text-ink backdrop-blur-md"
        }
      >
        <Link to="/" className="shrink-0 no-underline">
          <div
            className={
              sl
                ? "font-sans text-[13px] font-bold tracking-[0.14em] text-gold"
                : "font-sans text-[13px] font-bold tracking-[0.14em] text-accent"
            }
          >
            DROSSELAU
          </div>
          <div
            className={
              sl
                ? "font-sans text-[11px] tracking-wide text-[#d8c7a4]"
                : "font-sans text-[11px] tracking-wide text-mute"
            }
          >
            {catalog.subtitle}
          </div>
        </Link>
        <form onSubmit={search} className="relative min-w-[160px] flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-mute"
            strokeWidth={1.75}
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ort, Gasse, Name…"
            className={
              sl
                ? "w-full rounded-full border border-[#5c4630] bg-[#2a1f14] py-2 pl-9 pr-3.5 font-serif text-[15px] text-paper-2 outline-none placeholder:text-mute"
                : "w-full rounded-full border border-line bg-card py-2 pl-9 pr-3.5 font-serif text-[15px] text-ink outline-none placeholder:text-mute"
            }
            type="search"
          />
        </form>
        <Link
          to="/truppe"
          className={
            sl
              ? "shrink-0 rounded-full border border-[#6a5338] px-3 py-2 font-sans text-[12px] text-paper-2 no-underline"
              : "shrink-0 rounded-full border border-line px-3 py-2 font-sans text-[12px] text-mute no-underline"
          }
        >
          Truppe
        </Link>
        {!sl ? (
          <button
            type="button"
            onClick={() => setSicht("sl")}
            className="shrink-0 rounded-full border border-line px-3 py-2 font-sans text-[12px] font-semibold tracking-[0.14em] text-mute"
            aria-label="Zur Spielleitung"
            title="Spielleitung"
          >
            SL
          </button>
        ) : null}
        {sl ? (
          <>
            <div
              className="relative grid w-[200px] shrink-0 grid-cols-2 rounded-full border border-[#6a5338] p-0.5"
              role="group"
              aria-label="Sicht"
            >
              <span
                className={
                  "pointer-events-none absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-gold transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] " +
                  (sl ? "translate-x-[100%]" : "translate-x-0")
                }
              />
              <button
                type="button"
                onClick={() => setSicht("spieler")}
                className="relative z-10 rounded-full px-3 py-1.5 font-sans text-[13px] text-paper-2"
              >
                Am Tisch
              </button>
              <button
                type="button"
                aria-pressed
                className="relative z-10 rounded-full px-3 py-1.5 font-sans text-[13px] text-[#2a1f14]"
              >
                Schirm
              </button>
            </div>
            <details className="relative">
              <summary className="list-none rounded-full border border-[#6a5338] px-3 py-1.5 font-sans text-[13px] text-paper-2 [&::-webkit-details-marker]:hidden">
                Arbeit
              </summary>
              <div className="absolute right-0 z-30 mt-2 w-48 rounded-md border border-line bg-card p-2 text-ink shadow-[var(--shadow-card)]">
                <Link to="/eingang" className="block rounded-sm px-3 py-2 no-underline hover:bg-[#ead8b2]/70">
                  Eingang
                </Link>
                <Link to="/werkstatt" className="block rounded-sm px-3 py-2 no-underline hover:bg-[#ead8b2]/70">
                  Werkstatt
                </Link>
                <Link to="/leute" className="block rounded-sm px-3 py-2 no-underline hover:bg-[#ead8b2]/70">
                  Leute
                </Link>
                <Link to="/haeuser" className="block rounded-sm px-3 py-2 no-underline hover:bg-[#ead8b2]/70">
                  Häuser
                </Link>
                <Link to="/truppe" className="block rounded-sm px-3 py-2 no-underline hover:bg-[#ead8b2]/70">
                  Truppe
                </Link>
                <Link to="/quest" className="block rounded-sm px-3 py-2 no-underline hover:bg-[#ead8b2]/70">
                  Questlog
                </Link>
                <Link to="/stil" className="block rounded-sm px-3 py-2 no-underline hover:bg-[#ead8b2]/70">
                  Bildstil
                </Link>
                <Link to="/abgleich" className="block rounded-sm px-3 py-2 no-underline hover:bg-[#ead8b2]/70">
                  Abgleich
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Lokale Textänderungen verwerfen?")) resetCanon();
                  }}
                  className="block w-full rounded-sm px-3 py-2 text-left hover:bg-[#ead8b2]/70"
                >
                  Kanon wiederherstellen
                </button>
              </div>
            </details>
          </>
        ) : null}
      </header>
      <div className="flex gap-2 overflow-x-auto border-b border-line bg-card px-3 py-2 md:hidden">
        {catalog.districts.map((d) => {
          const active = pathname.includes(`/bezirk/${d.key}`);
          return (
            <Link
              key={d.key}
              to="/bezirk/$key"
              params={{ key: d.key }}
              className={
                "shrink-0 rounded-full border px-3 py-2 font-sans text-xs no-underline transition-colors duration-[150ms] " +
                (active
                  ? "border-accent bg-accent text-paper-2"
                  : "border-line text-ink")
              }
            >
              {d.short}
            </Link>
          );
        })}
      </div>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-line bg-card/55 px-3 py-4 md:block md:border-r">
          <h2 className="kicker mx-2 mt-1">Bezirke</h2>
          <nav className="mt-2 flex flex-col">
            {catalog.districts.map((d) => {
              const n = placesInDistrict(d.key, customPlaces).length;
              const active = pathname.includes(`/bezirk/${d.key}`);
              return (
                <Link
                  key={d.key}
                  to="/bezirk/$key"
                  params={{ key: d.key }}
                  className={
                    "flex items-center justify-between rounded-sm px-2.5 py-2 text-ink no-underline transition-colors duration-[150ms] " +
                    (active ? "bg-[#ead8b2]" : "hover:bg-[#ead8b2]/70")
                  }
                >
                  <span>{d.short}</span>
                  {sl ? <span className="font-sans text-xs text-mute">{n}</span> : null}
                </Link>
              );
            })}
          </nav>
          {sl ? (
            <>
              <h2 className="kicker mx-2 mt-5">Arbeit</h2>
              <Link
                to="/eingang"
                className="block rounded-sm px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
              >
                Eingang
              </Link>
              <Link
                to="/werkstatt"
                className="block rounded-sm px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
              >
                Werkstatt
              </Link>
              <Link
                to="/leute"
                className="block rounded-sm px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
              >
                Leute
              </Link>
              <Link
                to="/haeuser"
                className="block rounded-sm px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
              >
                Häuser
              </Link>
              <Link
                to="/quest/$id"
                params={{ id: "q-1" }}
                className="block rounded-sm px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
              >
                Aufträge
              </Link>
              <Link
                to="/stil"
                className="block rounded-sm px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
              >
                Bildstil
              </Link>
              <Link
                to="/abgleich"
                className="block rounded-sm px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
              >
                Verzeichnis
              </Link>
              {extraPages.map((p) => (
                <Link
                  key={p.id}
                  to="/seite/$id"
                  params={{ id: p.id }}
                  className="block rounded-sm px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
                >
                  {p.title}
                </Link>
              ))}
            </>
          ) : null}
        </aside>
        <main className="px-4 py-8 pb-24 sm:px-10">{children}</main>
      </div>
      {!sl ? (
        <footer className="px-4 pb-8 text-center">
          <button
            type="button"
            onClick={() => setSicht("sl")}
            className="kicker bg-transparent text-line-strong"
            aria-label="Zurück zum Schirm"
          >
            Anno {catalog.year.replace(/\s*IZ\.?$/i, "")}
          </button>
        </footer>
      ) : null}
    </div>
  );
}
