import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { QuestEditor } from "@/components/quest-editor";
import { SlGate } from "@/components/sl-gate";
import { useCatalog } from "@/lib/store";

export const Route = createFileRoute("/quest/$id")({
  component: () => (
    <SlGate>
      <QuestPage />
    </SlGate>
  ),
});

function QuestPage() {
  const { id } = Route.useParams();
  const quests = useCatalog((s) => s.quests);
  const upsert = useCatalog((s) => s.upsertQuest);
  const remove = useCatalog((s) => s.removeQuest);
  const navigate = useNavigate();
  const quest = quests.find((q) => q.id === id);

  if (!quest) {
    return (
      <AppShell>
        <p className="kicker m-0">Schirm</p>
        <h1 className="mt-2 font-serif text-4xl">Kein Auftrag</h1>
        <p className="mt-4 text-ink-soft">Die ID liegt nicht im Heft.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <p className="kicker m-0">Schirm</p>
      <h1 className="mt-2 font-serif text-4xl">{quest.name || "Erste Quest"}</h1>
      <div className="folio-rule mt-4" />
      <div className="mt-6">
        <QuestEditor
          quest={quest}
          onChange={upsert}
          onRemove={() => {
            remove(quest.id);
            void navigate({ to: "/quest" });
          }}
        />
      </div>
    </AppShell>
  );
}
