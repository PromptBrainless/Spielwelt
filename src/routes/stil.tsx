import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SlGate } from "@/components/sl-gate";
import { catalog } from "@/lib/catalog";
import { STYLE_LOCK } from "@/lib/style-lock";

export const Route = createFileRoute("/stil")({
  component: () => (
    <SlGate>
      <StilPage />
    </SlGate>
  ),
});

function StilPage() {
  return (
    <AppShell>
      <h1 className="font-serif text-4xl">Bildstil · Grok</h1>
      <p className="max-w-[62ch] text-[18px] leading-relaxed text-ink-soft">
        Die grafische Sorge sitzt hier, nicht in einer 3D-Stadt. Jedes Ortsschild bleibt ein
        Aquarell-Druck: Bogen oben, deutscher Name, Leiste DROSSELAU, nasse Straße. Grok bekommt denselben
        Brief wie du — plus den Stoff des Bezirks — und ändert nur, was du am Ort anweist.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {catalog.districts.map((d) => (
          <article key={d.key} className="rounded-[22px] border border-line bg-card p-4">
            <h2 className="m-0 text-xl">
              {d.num} · {d.name}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{d.intro}</p>
            <p className="mt-2 font-sans text-xs uppercase tracking-wider text-mute">Stoff</p>
            <p className="m-0">{d.fabric}</p>
          </article>
        ))}
      </div>
      <h2 className="mt-10 font-serif text-2xl">Was Grok nicht darf</h2>
      <ul className="mt-3 max-w-[70ch] list-disc space-y-2 pl-5">
        {catalog.laws.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <h2 className="mt-10 font-serif text-2xl">Maschinenbrief</h2>
      <pre className="mt-3 max-w-[75ch] overflow-auto whitespace-pre-wrap rounded-[22px] border border-line bg-card p-4 font-sans text-[13px] leading-relaxed text-ink-soft">
        {STYLE_LOCK}
      </pre>
      <p className="mt-6 max-w-[62ch] text-ink-soft">
        Am Ort: Änderung auf Deutsch schreiben → Auftrag schärfen → Schild bearbeiten. Das Ergebnis bleibt
        in diesem Browser. Heftfoto setzt zurück. Ein Klick, ein Bild — kein Dauerfeuer gegen die API.
      </p>
    </AppShell>
  );
}
