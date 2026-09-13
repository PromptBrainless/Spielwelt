import { AppShell } from "@/components/app-shell";
import { useCatalog } from "@/lib/store";

export function SlGate({ children }: { children: React.ReactNode }) {
  const sicht = useCatalog((s) => s.sicht);
  const setSicht = useCatalog((s) => s.setSicht);

  if (sicht === "sl") return children;

  return (
    <AppShell>
      <p className="kicker m-0">Vorbereitung</p>
      <h1 className="mt-2 font-serif text-4xl">Schirm</h1>
      <div className="folio-rule mt-4" />
      <p className="mt-4 max-w-[54ch] text-[18px] leading-relaxed text-ink-soft">
        Dieser Teil bleibt hinter dem Schirm. Unten auf die Jahreszahl tippen, wenn niemand mitliest.
      </p>
      <button
        type="button"
        onClick={() => setSicht("sl")}
        className="mt-6 rounded-full border border-[#5a2410] bg-accent px-4 py-2 font-sans text-[13px] text-paper-2"
      >
        Zum Schirm
      </button>
    </AppShell>
  );
}
