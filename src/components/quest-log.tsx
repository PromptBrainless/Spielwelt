import { Link } from "@tanstack/react-router";
import { displayName, placeById } from "@/lib/catalog";
import { QUEST_STATUSES, statusLabel, type Quest, type QuestStatus } from "@/lib/quest";
import { useCatalog } from "@/lib/store";
import { QuestNodes } from "@/components/quest-nodes";

const SERIES_ORDER = ["Das Kontor", "Die Ordnung", "Rattenwinkel"];

function houseLabel(id: string): string {
  if (!id) return "—";
  const p = placeById(id);
  if (!p) return id;
  return `${id} · ${displayName(p)}`;
}

function groupQuests(quests: Quest[]): { title: string; rows: Quest[] }[] {
  const map = new Map<string, Quest[]>();
  for (const q of quests) {
    const key = q.series.trim() || "ohne Reihe";
    const cur = map.get(key) || [];
    cur.push(q);
    map.set(key, cur);
  }
  const titles = [
    ...SERIES_ORDER.filter((s) => map.has(s)),
    ...[...map.keys()].filter((k) => !SERIES_ORDER.includes(k)),
  ];
  return titles.map((title) => ({ title, rows: map.get(title) || [] }));
}

export function QuestLog() {
  const quests = useCatalog((s) => s.quests);
  const setStatus = useCatalog((s) => s.setQuestStatus);
  const groups = groupQuests(quests);

  return (
    <div className="mt-8 space-y-12">
      {groups.map((g) => (
        <section key={g.title}>
          <p className="kicker m-0 text-gold">{g.rows.length} Teile</p>
          <h2 className="mt-1 font-serif text-3xl text-paper-2">{g.title}</h2>
          <div className="folio-rule mt-3" />
          <div className="mt-6 space-y-6">
            {g.rows.map((q) => (
              <QuestLogCard key={q.id} quest={q} onStatus={(s) => setStatus(q.id, s)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function QuestLogCard({
  quest,
  onStatus,
}: {
  quest: Quest;
  onStatus: (s: QuestStatus) => void;
}) {
  const places = [...new Set(quest.triggers.map((t) => t.place).filter(Boolean))];
  const wahl = quest.tree.map((b) => b.label).filter(Boolean);

  return (
    <article className="rounded-md border border-[#5c4630] bg-[#2a1f14] p-4 text-paper-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="kicker m-0 text-gold">
            {quest.id} · {statusLabel(quest.status)}
          </p>
          <h3 className="mt-1 font-serif text-2xl">
            <Link
              to="/quest/$id"
              params={{ id: quest.id }}
              className="text-paper-2 no-underline hover:underline"
            >
              {quest.name || "ohne Namen"}
            </Link>
          </h3>
        </div>
        <label className="font-sans text-[12px] text-[#d8c7a4]">
          Status
          <select
            value={quest.status}
            onChange={(e) => onStatus(e.target.value as QuestStatus)}
            className="ml-2 rounded-full border border-[#6a5338] bg-[#1c140e] px-2 py-1 text-paper-2"
          >
            {QUEST_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <QuestNodes quest={quest} />

      <dl className="mt-4 grid gap-3 text-[15px] leading-relaxed sm:grid-cols-2">
        <div>
          <dt className="kicker text-[#d8c7a4]">Geber</dt>
          <dd className="mt-1">{quest.giver.name || "—"}{quest.giver.fear ? ` · fürchtet: ${quest.giver.fear}` : ""}</dd>
        </div>
        <div>
          <dt className="kicker text-[#d8c7a4]">Orte</dt>
          <dd className="mt-1">
            {places.length
              ? places.map((id) => (
                  <Link
                    key={id}
                    to="/ort/$id"
                    params={{ id }}
                    className="mr-2 text-gold no-underline hover:underline"
                  >
                    {houseLabel(id)}
                  </Link>
                ))
              : "—"}
          </dd>
        </div>
        <div>
          <dt className="kicker text-[#d8c7a4]">Glauben (Tisch)</dt>
          <dd className="mt-1 text-[#ead8b2]">{quest.story.believes || "—"}</dd>
        </div>
        <div>
          <dt className="kicker text-gold">War / Twist (Schirm)</dt>
          <dd className="mt-1">
            {quest.story.happened || "—"}
            {quest.story.twist ? ` ${quest.story.twist}` : ""}
          </dd>
        </div>
        <div>
          <dt className="kicker text-[#d8c7a4]">Wahl</dt>
          <dd className="mt-1">{wahl.length ? wahl.join(" · ") : "—"}</dd>
        </div>
        <div>
          <dt className="kicker text-[#d8c7a4]">Welt danach</dt>
          <dd className="mt-1">{quest.world.npcs || quest.world.places || quest.nodes.welt || "—"}</dd>
        </div>
      </dl>

      <p className="mt-3 font-sans text-[13px] text-[#d8c7a4]">
        Folge {quest.follow || "—"}
        {quest.requires ? ` · braucht ${quest.requires}` : ""}
        {" · "}
        <Link to="/quest/$id" params={{ id: quest.id }} className="text-gold no-underline hover:underline">
          Editor
        </Link>
      </p>
    </article>
  );
}
