import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SnippetSelect } from "@/components/field-edit";
import { SlGate } from "@/components/sl-gate";
import { districtByKey } from "@/lib/catalog";
import { useCatalog } from "@/lib/store";

export const Route = createFileRoute("/seite/$id")({
  component: () => (
    <SlGate>
      <SeitePage />
    </SlGate>
  ),
});

function SeitePage() {
  const { id } = Route.useParams();
  const extraPages = useCatalog((s) => s.extraPages);
  const upsertPage = useCatalog((s) => s.upsertPage);
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
      <div className="mt-4 max-w-[72ch]">
        <SnippetSelect
          label="Gemerktes übernehmen…"
          keys={["sieht", "riecht", "wer", "spieltext", "szene", "sl", "geruecht", "eskalation"]}
          onPick={(text) =>
            upsertPage({ ...page, body: page.body ? `${page.body.trim()}\n\n${text}` : text })
          }
        />
      </div>
      <textarea
        value={page.body}
        onChange={(e) => upsertPage({ ...page, body: e.target.value })}
        rows={16}
        className="mt-6 w-full rounded-[22px] border border-line bg-card px-4 py-3 font-serif text-[16px] leading-relaxed"
      />
    </AppShell>
  );
}
