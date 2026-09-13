import { Link } from "@tanstack/react-router";
import { questsAtPlace, statusLabel } from "@/lib/quest";
import { useCatalog } from "@/lib/store";

export function QuestCard({ placeId }: { placeId: string }) {
  const quests = useCatalog((s) => s.quests);
  const sicht = useCatalog((s) => s.sicht);
  const hits = questsAtPlace(quests, placeId);
  const sl = sicht === "sl";
  const shown = sl ? hits : hits.filter((h) => h.quest.status !== "still");
  if (shown.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {shown.map(({ quest, trigger }) => (
        <div key={`${quest.id}-${trigger.id}`}>
          <div className={sl ? "kicker text-gold" : "kicker"}>
            Auftrag · {statusLabel(quest.status)}
            {trigger.kind ? ` · ${trigger.kind}` : ""}
          </div>
          {sl ? (
            <>
              <p className="mt-1 font-serif text-lg text-paper-2">{quest.name || "Erste Quest"}</p>
              <p className="mt-1 text-sm leading-relaxed text-paper-2">
                {trigger.condition || quest.nodes.trigger || "Trigger an diesem Ort."}
              </p>
              <Link
                to="/quest/$id"
                params={{ id: quest.id }}
                className="mt-1 inline-block font-sans text-[13px] text-gold no-underline hover:underline"
              >
                zum Editor
              </Link>
            </>
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">
              {quest.story.believes || "Hier hängt ein Auftrag."}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
