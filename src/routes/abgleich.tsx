import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { SlGate } from "@/components/sl-gate";
import { catalog } from "@/lib/catalog";

export const Route = createFileRoute("/abgleich")({
  component: () => (
    <SlGate>
      <AbgleichPage />
    </SlGate>
  ),
});

function AbgleichPage() {
  const kern = catalog.places.filter((p) => p.kern);
  return (
    <AppShell>
      <h1 className="font-serif text-4xl">Abgleich Verzeichnis</h1>
      <p className="max-w-[62ch] text-[18px] text-ink-soft">
        Fotoheft und Kampagnenverzeichnis gelten beide. Der Kern trägt Hausnamen und Status, die
        Erweiterung bleibt Sichtbefund.
      </p>
      <ul className="mt-6 max-w-[70ch] list-disc space-y-2 pl-5">
        {catalog.abgleich.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <h2 className="mt-10 font-serif text-2xl">Harte Setzungen</h2>
      <ul className="mt-3 max-w-[70ch] list-disc space-y-2 pl-5">
        {catalog.laws.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <h2 className="mt-10 font-serif text-2xl">Kern — Foto zu Gasse</h2>
      <ul className="mt-3 space-y-1">
        {kern.map((p) => (
          <li key={p.id}>
            <Link to="/ort/$id" params={{ id: p.id }} className="text-accent no-underline hover:underline">
              <strong>{p.id}</strong> · {p.kanon || p.name}
            </Link>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
