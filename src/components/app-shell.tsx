import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { catalog, placesInDistrict } from "@/lib/catalog";
import { useCatalog } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const hideSl = useCatalog((s) => s.hideSl);
  const setHideSl = useCatalog((s) => s.setHideSl);
  const resetCanon = useCatalog((s) => s.resetCanon);
  const customPlaces = useCatalog((s) => s.customPlaces);
  const extraPages = useCatalog((s) => s.extraPages);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [q, setQ] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  function search(e: React.FormEvent) {
    e.preventDefault();
    const t = q.trim();
    if (!t) return;
    navigate({ to: "/", search: { q: t } });
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 bg-bar/95 px-4 py-2.5 text-paper-2 backdrop-blur-md">
        <Link to="/" className="shrink-0 no-underline">
          <div className="font-sans text-[13px] font-bold tracking-[0.14em] text-gold">
            DROSSELAU
          </div>
          <div className="font-sans text-[11px] font-normal tracking-wide text-[#d8c7a4]">
            Ortskatalog 2512 · {catalog.count + customPlaces.length} Orte
          </div>
        </Link>
        <form onSubmit={search} className="min-w-[160px] flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ort, Gasse, Name, Gerücht…"
            className="w-full rounded-full border border-[#5c4630] bg-[#2a1f14] px-3.5 py-2 font-serif text-[15px] text-paper-2 outline-none placeholder:text-mute"
            type="search"
          />
        </form>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/eingang"
            className="rounded-full border border-[#5a2410] bg-accent px-3 py-1.5 font-sans text-[13px] text-paper-2 no-underline"
          >
            Eingang
          </Link>
          <Link
            to="/abgleich"
            className="rounded-full border border-[#6a5338] px-3 py-1.5 font-sans text-[13px] text-paper-2 no-underline"
          >
            Abgleich
          </Link>
          <Link
            to="/stil"
            className="rounded-full border border-[#6a5338] px-3 py-1.5 font-sans text-[13px] text-paper-2 no-underline"
          >
            Bildstil
          </Link>
          <button
            type="button"
            onClick={() => setHideSl(!hideSl)}
            className="rounded-full border border-[#6a5338] bg-transparent px-3 py-1.5 font-sans text-[13px] text-paper-2"
          >
            {hideSl ? "SL zeigen" : "SL ausblenden"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("Lokale Textänderungen verwerfen?")) resetCanon();
            }}
            className="rounded-full border border-[#6a5338] bg-transparent px-3 py-1.5 font-sans text-[13px] text-paper-2"
          >
            Kanon
          </button>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-line bg-card/55 px-3 py-4 md:block md:border-r">
          <h2 className="mx-2 mt-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
            Bezirke
          </h2>
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
                    "flex items-center justify-between rounded-lg px-2.5 py-2 text-ink no-underline " +
                    (active ? "bg-[#ead8b2]" : "hover:bg-[#ead8b2]/70")
                  }
                >
                  <span>
                    {d.num} · {d.short}
                  </span>
                  <span className="font-sans text-xs text-mute">{n}</span>
                </Link>
              );
            })}
          </nav>
          <h2 className="mx-2 mt-5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-mute">
            Arbeit
          </h2>
          <Link
            to="/eingang"
            className="block rounded-lg px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
          >
            Eingang
          </Link>
          <Link
            to="/stil"
            className="block rounded-lg px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
          >
            Grok Bildstil
          </Link>
          <Link
            to="/abgleich"
            className="block rounded-lg px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
          >
            Verzeichnis
          </Link>
          {extraPages.map((p) => (
            <Link
              key={p.id}
              to="/seite/$id"
              params={{ id: p.id }}
              className="block rounded-lg px-2.5 py-2 text-ink no-underline hover:bg-[#ead8b2]/70"
            >
              {p.title}
            </Link>
          ))}
        </aside>
        <main className="px-4 py-7 pb-20 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

