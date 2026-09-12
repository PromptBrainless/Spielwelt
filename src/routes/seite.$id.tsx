import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { districtByKey } from "@/lib/catalog";
import { useCatalog } from "@/lib/store";

export const Route = createFileRoute("/seite/$id")({
  component: SeitePage,
});

function SeitePage() {
  const { id } = Route.useParams();
  const extraPages = useCatalog((s) => s.extraPages);
  const upsertPage = useCatalog((s) => s.upsertPage);
  const hideSl = useCatalog((s) => s.hideSl);
  const page = extraPages.find((p) => p.id === id);

  if (!page) {
    return (
      <AppShell>
        <p>Seite fehlt.</p>
        <Link to="/eingang" className="text-accent">
          Zum Eingang
        </Link>
      </AppShell>
    );
  }

  const d = page.district ? districtByKey(page.district) : undefined;

  if (hideSl) {
    return (
      <AppShell>
        <p className="text-ink-soft">Diese Seite ist nur für die Spielleitung.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <p className="m-0 font-sans text-xs uppercase tracking-[0.14em] text-mute">Eigene SL-Seite</p>
      <input
        value={page.title}
        onChange={(e) => upsertPage({ ...page, title: e.target.value })}
        className="mt-2 w-full border-0 bg-transparent font-serif text-4xl text-ink outline-none"
      />
      {d ? (
        <p className="text-mute">
          {d.num} · {d.name}
        </p>
      ) : null}
      <textarea
        value={page.body}
        onChange={(e) => upsertPage({ ...page, body: e.target.value })}
        rows={16}
        className="mt-6 w-full rounded-[22px] border border-line bg-card px-4 py-3 font-serif text-[16px] leading-relaxed"
      />
    </AppShell>
  );
}
