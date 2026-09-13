import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { QuestLog } from "@/components/quest-log";
import { SlGate } from "@/components/sl-gate";
import { emptyQuest } from "@/lib/quest";
import { useCatalog } from "@/lib/store";

export const Route = createFileRoute("/quest/")({
  component: QuestIndex,
});

function QuestIndex() {
  const sicht = useCatalog((s) => s.sicht);
  if (sicht !== "sl") return <PlayerLog />;
  return (
    <SlGate>
      <SlList />
    </SlGate>
  );
}

function SlList() {
  const upsert = useCatalog((s) => s.upsertQuest);
  const navigate = useNavigate();

  function neu() {
    const q = emptyQuest();
    upsert(q);
    void navigate({ to: "/quest/$id", params: { id: q.id } });
  }

  return (
    <AppShell>
      <p className="kicker m-0">Schirm</p>
      <h1 className="mt-2 font-serif text-4xl">Questlog</h1>
      <div className="folio-rule mt-4" />
      <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-[#ead8b2]">
        Übersicht für den Tisch: Geber, was sie glauben, was war, die Wahl, was sich ändert.
        Spieler sehen das nicht. Editor nur wenn du streichen willst.
      </p>
      <button
        type="button"
        onClick={neu}
        className="mt-6 rounded-full border border-[#5a2410] bg-accent px-4 py-2 font-sans text-[13px] text-paper-2"
      >
        Neuer Auftrag
      </button>
      <QuestLog />
    </AppShell>
  );
}

function PlayerLog() {
  const quests = useCatalog((s) => s.quests).filter((q) => q.status === "aktiv" || q.status === "gelegt");
  return (
    <AppShell>
      <p className="kicker m-0">Am Tisch</p>
      <h1 className="mt-2 font-serif text-4xl">Aufträge</h1>
      <div className="folio-rule mt-4" />
      {quests.length === 0 ? (
        <p className="mt-4 max-w-[54ch] text-[18px] leading-relaxed text-ink-soft">
          Kein Auftrag liegt auf dem Tisch.
        </p>
      ) : (
        <ul className="mt-6 list-none space-y-6 p-0">
          {quests.map((q) => (
            <li key={q.id} className="max-w-[58ch]">
              <h2 className="font-serif text-2xl">{q.name || "Auftrag"}</h2>
              <p className="mt-2 leading-relaxed">{q.story.believes || "Der SL sagt, was ihr gehört habt."}</p>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
