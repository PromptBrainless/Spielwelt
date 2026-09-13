import { NODE_KEYS, NODE_LABELS, nodeFilled, type Quest, type QuestNodeKey } from "@/lib/quest";

export function QuestNodes({
  quest,
  onPick,
}: {
  quest: Quest;
  onPick?: (key: QuestNodeKey) => void;
}) {
  return (
    <ol className="m-0 flex list-none flex-wrap gap-1 p-0">
      {NODE_KEYS.map((key, i) => {
        const on = nodeFilled(quest, key);
        return (
          <li key={key} className="flex items-center gap-1">
            {i > 0 ? <span className="font-sans text-xs text-mute">→</span> : null}
            <button
              type="button"
              onClick={() => onPick?.(key)}
              className={
                "rounded-full border px-2.5 py-1 font-sans text-[12px] " +
                (on ? "border-line-strong bg-card text-ink" : "border-line text-mute")
              }
            >
              {NODE_LABELS[key]}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
