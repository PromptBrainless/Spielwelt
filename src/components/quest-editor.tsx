import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { displayName, allPlaces } from "@/lib/catalog";
import type { Place } from "@/lib/types";
import {
  DIFFICULTIES,
  GOAL_KINDS,
  PRIORITIES,
  QUEST_TYPES,
  TRIGGER_KINDS,
  VARIANT_KEYS,
  emptyQuest,
  giverFromPerson,
  nid,
  statusLabel,
  type DecisionBranch,
  type Quest,
  type QuestGoal,
  type QuestNodeKey,
  type QuestStatus,
  type QuestTrigger,
} from "@/lib/quest";
import { QuestNodes } from "@/components/quest-nodes";
import { mergePlace, useCatalog } from "@/lib/store";

const STATUSES: QuestStatus[] = ["still", "gelegt", "aktiv", "fertig"];

function Field({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="kicker">{label}</span>
      {rows <= 1 ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-serif text-[16px]"
        />
      ) : (
        <textarea
          value={value}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-serif text-[16px] leading-relaxed"
        />
      )}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="kicker">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-sans text-[14px]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line pt-6">
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function BranchEdit({
  branch,
  onChange,
  onRemove,
  depth = 0,
}: {
  branch: DecisionBranch;
  onChange: (b: DecisionBranch) => void;
  onRemove: () => void;
  depth?: number;
}) {
  return (
    <div className={depth ? "ml-4 border-l border-line pl-3" : ""}>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={branch.label}
          onChange={(e) => onChange({ ...branch, label: e.target.value })}
          className="rounded-sm border border-line bg-card px-2 py-2 font-serif"
        />
        <input
          value={branch.outcome}
          onChange={(e) => onChange({ ...branch, outcome: e.target.value })}
          className="rounded-sm border border-line bg-card px-2 py-2 font-serif"
        />
      </div>
      <div className="mt-1 flex gap-3">
        <button
          type="button"
          className="font-sans text-[13px] text-accent"
          onClick={() =>
            onChange({
              ...branch,
              children: [...branch.children, { id: nid("d"), label: "", outcome: "", children: [] }],
            })
          }
        >
          Zweig darunter
        </button>
        <button type="button" className="font-sans text-[13px] text-mute" onClick={onRemove}>
          weg
        </button>
      </div>
      <div className="mt-2 space-y-2">
        {branch.children.map((c, i) => (
          <BranchEdit
            key={c.id}
            branch={c}
            depth={depth + 1}
            onChange={(next) => {
              const children = branch.children.slice();
              children[i] = next;
              onChange({ ...branch, children });
            }}
            onRemove={() => onChange({ ...branch, children: branch.children.filter((_, j) => j !== i) })}
          />
        ))}
      </div>
    </div>
  );
}

export function QuestEditor({
  quest,
  onChange,
  onRemove,
}: {
  quest: Quest;
  onChange: (q: Quest) => void;
  onRemove: () => void;
}) {
  const people = useCatalog((s) => s.extraPeople);
  const patches = useCatalog((s) => s.patches);
  const customPlaces = useCatalog((s) => s.customPlaces);
  const places = allPlaces(customPlaces).map((p) => mergePlace(p, patches));

  function set<K extends keyof Quest>(key: K, value: Quest[K]) {
    onChange({ ...quest, [key]: value });
  }

  function jump(key: QuestNodeKey) {
    const map: Record<QuestNodeKey, string> = {
      trigger: "einstieg",
      geber: "geber",
      aufgabe: "ziele",
      hinweise: "story",
      konflikt: "story",
      entscheidung: "baum",
      konsequenz: "sl",
      belohnung: "lohn",
      welt: "welt",
      folge: "meta",
    };
    document.getElementById(map[key])?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="max-w-[72ch]">
      <div className="sticky top-12 z-10 -mx-1 bg-paper/95 px-1 py-3 backdrop-blur-sm">
        <QuestNodes quest={quest} onPick={jump} />
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => set("status", s)}
            className={
              "rounded-full border px-3 py-1.5 font-sans text-[13px] " +
              (quest.status === s ? "border-accent bg-accent text-paper-2" : "border-line-strong bg-card")
            }
          >
            {statusLabel(s)}
          </button>
        ))}
      </div>

      <Section id="meta" title="1 · Metadaten">
        <Field label="Name" value={quest.name} rows={1} onChange={(v) => set("name", v)} />
        <Select label="Typ" value={quest.type} options={QUEST_TYPES} onChange={(v) => set("type", v)} />
        <Select label="Schwierigkeit" value={quest.difficulty} options={DIFFICULTIES} onChange={(v) => set("difficulty", v)} />
        <Field label="Karriere" value={quest.career} rows={1} onChange={(v) => set("career", v)} />
        <Field label="Fraktion" value={quest.faction} rows={1} onChange={(v) => set("faction", v)} />
        <Field label="Region" value={quest.region} rows={1} onChange={(v) => set("region", v)} />
        <Select label="Priorität" value={quest.priority} options={PRIORITIES} onChange={(v) => set("priority", v)} />
        <label className="flex items-center gap-2 pt-6 font-sans text-sm">
          <input type="checkbox" checked={quest.repeatable} onChange={(e) => set("repeatable", e.target.checked)} />
          Wiederholbar
        </label>
        <Field label="Voraussetzungen" value={quest.requires} onChange={(v) => set("requires", v)} />
        <Field label="Folgequest" value={quest.follow} rows={1} onChange={(v) => set("follow", v)} />
        <Field label="Questreihe" value={quest.series} rows={1} onChange={(v) => set("series", v)} />
      </Section>

      <Section id="einstieg" title="2 · Einstieg · Trigger">
        <p className="sm:col-span-2 m-0 text-[15px] text-ink-soft">
          Haus aus dem Katalog. Person nur, wenn du sie unter Leute angelegt hast.
        </p>
        {quest.triggers.map((t, i) => (
          <TriggerEdit
            key={t.id}
            trigger={t}
            places={places}
            people={people}
            onChange={(next) => {
              const triggers = quest.triggers.slice();
              triggers[i] = next;
              set("triggers", triggers);
            }}
            onRemove={() => set("triggers", quest.triggers.filter((_, j) => j !== i))}
          />
        ))}
        <button
          type="button"
          className="font-sans text-[13px] text-accent"
          onClick={() => set("triggers", [...quest.triggers, { ...emptyQuest().triggers[0], id: nid("t") }])}
        >
          Trigger hinzufügen
        </button>
        <div className="sm:col-span-2">
          <Field label="Knoten · Trigger" value={quest.nodes.trigger} onChange={(v) => set("nodes", { ...quest.nodes, trigger: v })} />
        </div>
      </Section>

      <Section id="geber" title="3 · Auftraggeber">
        <label className="block sm:col-span-2">
          <span className="kicker">Aus den Leuten</span>
          <select
            value={quest.giver.npcId}
            onChange={(e) => {
              const p = people.find((x) => x.id === e.target.value);
              set("giver", p ? { ...quest.giver, ...giverFromPerson(p) } : { ...quest.giver, npcId: "" });
            }}
            className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-sans text-[14px]"
          >
            <option value="">{people.length ? "—" : "— zuerst Person anlegen —"}</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.role}
              </option>
            ))}
          </select>
        </label>
        <Field label="Name" value={quest.giver.name} rows={1} onChange={(v) => set("giver", { ...quest.giver, name: v })} />
        <Field label="Rasse" value={quest.giver.race} rows={1} onChange={(v) => set("giver", { ...quest.giver, race: v })} />
        <Field label="Alter" value={quest.giver.age} rows={1} onChange={(v) => set("giver", { ...quest.giver, age: v })} />
        <Field label="Beruf" value={quest.giver.role} rows={1} onChange={(v) => set("giver", { ...quest.giver, role: v })} />
        <Field label="Fraktion" value={quest.giver.faction} rows={1} onChange={(v) => set("giver", { ...quest.giver, faction: v })} />
        <Field label="Gesinnung" value={quest.giver.alignment} rows={1} onChange={(v) => set("giver", { ...quest.giver, alignment: v })} />
        <Field label="Sozialstatus" value={quest.giver.status} rows={1} onChange={(v) => set("giver", { ...quest.giver, status: v })} />
        <Field label="Beziehungen" value={quest.giver.ties} onChange={(v) => set("giver", { ...quest.giver, ties: v })} />
        <Field label="Feinde" value={quest.giver.enemies} onChange={(v) => set("giver", { ...quest.giver, enemies: v })} />
        <Field label="Geheimnisse" value={quest.giver.secrets} onChange={(v) => set("giver", { ...quest.giver, secrets: v })} />
        <Field label="Motivation" value={quest.giver.motive} onChange={(v) => set("giver", { ...quest.giver, motive: v })} />
        <Field label="Angst" value={quest.giver.fear} onChange={(v) => set("giver", { ...quest.giver, fear: v })} />
        <Field label="Ziele" value={quest.giver.goals} onChange={(v) => set("giver", { ...quest.giver, goals: v })} />
        <div className="sm:col-span-2">
          <Field label="Knoten · Geber" value={quest.nodes.geber} onChange={(v) => set("nodes", { ...quest.nodes, geber: v })} />
        </div>
      </Section>

      <Section id="story" title="4 · Erzählstruktur">
        <div className="sm:col-span-2">
          <Field label="Was glaubt der Spieler?" value={quest.story.believes} rows={3} onChange={(v) => set("story", { ...quest.story, believes: v })} />
        </div>
        <Field label="Was ist tatsächlich passiert?" value={quest.story.happened} rows={3} onChange={(v) => set("story", { ...quest.story, happened: v })} />
        <Field label="Plot Twist" value={quest.story.twist} rows={3} onChange={(v) => set("story", { ...quest.story, twist: v })} />
        <div className="sm:col-span-2">
          <Field label="Wahrheit am Ende" value={quest.story.truth} rows={3} onChange={(v) => set("story", { ...quest.story, truth: v })} />
        </div>
        <Field label="Knoten · Hinweise" value={quest.nodes.hinweise} onChange={(v) => set("nodes", { ...quest.nodes, hinweise: v })} />
        <Field label="Knoten · Konflikt" value={quest.nodes.konflikt} onChange={(v) => set("nodes", { ...quest.nodes, konflikt: v })} />
      </Section>

      <Section id="ziele" title="5 · Ziele">
        {quest.goals.map((g, i) => (
          <GoalEdit
            key={g.id}
            goal={g}
            onChange={(next) => {
              const goals = quest.goals.slice();
              goals[i] = next;
              set("goals", goals);
            }}
            onRemove={() => set("goals", quest.goals.filter((_, j) => j !== i))}
          />
        ))}
        <button
          type="button"
          className="font-sans text-[13px] text-accent"
          onClick={() => set("goals", [...quest.goals, { ...emptyQuest().goals[0], id: nid("g") }])}
        >
          Ziel hinzufügen
        </button>
        <div className="sm:col-span-2">
          <Field label="Knoten · Aufgabe" value={quest.nodes.aufgabe} onChange={(v) => set("nodes", { ...quest.nodes, aufgabe: v })} />
        </div>
      </Section>

      <Section id="welt" title="6 · Welt nach Abschluss">
        <Field label="NPCs ändern" value={quest.world.npcs} onChange={(v) => set("world", { ...quest.world, npcs: v })} />
        <Field label="Dialoge" value={quest.world.dialogs} onChange={(v) => set("world", { ...quest.world, dialogs: v })} />
        <Field label="Orte" value={quest.world.places} onChange={(v) => set("world", { ...quest.world, places: v })} />
        <Field label="Händler" value={quest.world.traders} onChange={(v) => set("world", { ...quest.world, traders: v })} />
        <Field label="Gegner" value={quest.world.enemies} onChange={(v) => set("world", { ...quest.world, enemies: v })} />
        <Field label="Fraktionen" value={quest.world.factions} onChange={(v) => set("world", { ...quest.world, factions: v })} />
        <div className="sm:col-span-2">
          <Field label="Knoten · Welt" value={quest.nodes.welt} onChange={(v) => set("nodes", { ...quest.nodes, welt: v })} />
        </div>
      </Section>

      <section id="baum" className="scroll-mt-24 border-t border-line pt-6">
        <h2 className="font-serif text-2xl">7 · Entscheidungsbaum</h2>
        <div className="mt-4 space-y-3">
          {quest.tree.map((b, i) => (
            <BranchEdit
              key={b.id}
              branch={b}
              onChange={(next) => {
                const tree = quest.tree.slice();
                tree[i] = next;
                set("tree", tree);
              }}
              onRemove={() => set("tree", quest.tree.filter((_, j) => j !== i))}
            />
          ))}
          <button
            type="button"
            className="font-sans text-[13px] text-accent"
            onClick={() => set("tree", [...quest.tree, { id: nid("d"), label: "", outcome: "", children: [] }])}
          >
            Wurzelzweig
          </button>
          <Field label="Knoten · Entscheidung" value={quest.nodes.entscheidung} onChange={(v) => set("nodes", { ...quest.nodes, entscheidung: v })} />
        </div>
      </section>

      <Section id="lohn" title="8 · Belohnung">
        <Field label="Sichtbar · Groschen" value={quest.rewards.groschen} rows={1} onChange={(v) => set("rewards", { ...quest.rewards, groschen: v })} />
        <Field label="Sichtbar · Erfahrung" value={quest.rewards.xp} rows={1} onChange={(v) => set("rewards", { ...quest.rewards, xp: v })} />
        <Field label="Sichtbar · Gegenstände" value={quest.rewards.items} onChange={(v) => set("rewards", { ...quest.rewards, items: v })} />
        <Field label="Versteckt · Ruf" value={quest.rewards.ruf} onChange={(v) => set("rewards", { ...quest.rewards, ruf: v })} />
        <Field label="Versteckt · Beziehungen" value={quest.rewards.ties} onChange={(v) => set("rewards", { ...quest.rewards, ties: v })} />
        <Field label="Versteckt · Weltzustand" value={quest.rewards.world} onChange={(v) => set("rewards", { ...quest.rewards, world: v })} />
        <Field label="Freischaltungen" value={quest.rewards.unlocks} onChange={(v) => set("rewards", { ...quest.rewards, unlocks: v })} />
        <Field label="Fraktionswerte" value={quest.rewards.faction} onChange={(v) => set("rewards", { ...quest.rewards, faction: v })} />
        <div className="sm:col-span-2">
          <Field label="Knoten · Belohnung" value={quest.nodes.belohnung} onChange={(v) => set("nodes", { ...quest.nodes, belohnung: v })} />
        </div>
      </Section>

      <Section id="lore" title="9 · Story-Datenbank">
        <Field label="Orte" value={quest.lore.places} onChange={(v) => set("lore", { ...quest.lore, places: v })} />
        <Field label="Fraktionen" value={quest.lore.factions} onChange={(v) => set("lore", { ...quest.lore, factions: v })} />
        <Field label="Personen" value={quest.lore.people} onChange={(v) => set("lore", { ...quest.lore, people: v })} />
        <Field label="Ereignisse" value={quest.lore.events} onChange={(v) => set("lore", { ...quest.lore, events: v })} />
        <Field label="Zeit" value={quest.lore.when} rows={1} onChange={(v) => set("lore", { ...quest.lore, when: v })} />
      </Section>

      <section id="sl" className="scroll-mt-24 border-t border-line pt-6">
        <h2 className="font-serif text-2xl">10 · Spielleiter</h2>
        <div className="mt-4">
          <Field label="Mögliche Spieleraktionen" value={quest.actions} rows={3} onChange={(v) => set("actions", v)} />
        </div>
        <div className="mt-6 space-y-6">
          {VARIANT_KEYS.map((key) => {
            const v = quest.variants.find((x) => x.key === key) ?? {
              key, player: "", npcs: "", ruf: "", next: "", fight: false, consequence: "",
            };
            return (
              <div key={key} className="rounded-sm border border-line bg-card p-3">
                <div className="kicker">{key}</div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Field label="Spieler tun" value={v.player} onChange={(t) => patchVariant(quest, onChange, key, { player: t })} />
                  <Field label="NPC-Reaktion" value={v.npcs} onChange={(t) => patchVariant(quest, onChange, key, { npcs: t })} />
                  <Field label="Ruf" value={v.ruf} onChange={(t) => patchVariant(quest, onChange, key, { ruf: t })} />
                  <Field label="Neue Quests" value={v.next} onChange={(t) => patchVariant(quest, onChange, key, { next: t })} />
                  <Field label="Konsequenz" value={v.consequence} onChange={(t) => patchVariant(quest, onChange, key, { consequence: t })} />
                  <label className="flex items-center gap-2 pt-6 font-sans text-sm">
                    <input type="checkbox" checked={v.fight} onChange={(e) => patchVariant(quest, onChange, key, { fight: e.target.checked })} />
                    Kampf
                  </label>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Knoten · Konsequenz" value={quest.nodes.konsequenz} onChange={(v) => set("nodes", { ...quest.nodes, konsequenz: v })} />
          <Field label="Knoten · Folge" value={quest.nodes.folge} onChange={(v) => set("nodes", { ...quest.nodes, folge: v })} />
        </div>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-6">
        <Link to="/quest" className="font-sans text-[13px] text-accent no-underline">
          alle Aufträge
        </Link>
        <button
          type="button"
          className="font-sans text-[13px] text-mute"
          onClick={() => {
            if (confirm("Diesen Auftrag löschen?")) onRemove();
          }}
        >
          löschen
        </button>
      </div>
    </div>
  );
}

function patchVariant(
  quest: Quest,
  onChange: (q: Quest) => void,
  key: (typeof VARIANT_KEYS)[number],
  patch: Partial<Quest["variants"][number]>,
) {
  const variants = VARIANT_KEYS.map((k) => {
    const cur = quest.variants.find((x) => x.key === k) ?? {
      key: k, player: "", npcs: "", ruf: "", next: "", fight: false, consequence: "",
    };
    return k === key ? { ...cur, ...patch } : cur;
  });
  onChange({ ...quest, variants });
}

function TriggerEdit({
  trigger,
  places,
  people,
  onChange,
  onRemove,
}: {
  trigger: QuestTrigger;
  places: Place[];
  people: { id: string; name: string }[];
  onChange: (t: QuestTrigger) => void;
  onRemove: () => void;
}) {
  return (
    <div className="sm:col-span-2 grid gap-3 rounded-sm border border-line bg-card p-3 sm:grid-cols-2">
      <Select label="Art" value={trigger.kind} options={TRIGGER_KINDS} onChange={(v) => onChange({ ...trigger, kind: v })} />
      <label className="block">
        <span className="kicker">Ort</span>
        <select
          value={trigger.place}
          onChange={(e) => onChange({ ...trigger, place: e.target.value })}
          className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-sans text-[14px]"
        >
          <option value="">—</option>
          {places.map((p) => (
            <option key={p.id} value={p.id}>
              {displayName(p)}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="kicker">NPC</span>
        <select
          value={trigger.npc}
          onChange={(e) => onChange({ ...trigger, npc: e.target.value })}
          className="mt-1 w-full rounded-sm border border-line bg-card px-2 py-2 font-sans text-[14px]"
        >
          <option value="">{people.length ? "—" : "— zuerst Person anlegen —"}</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </label>
      <Field label="Wahrscheinlichkeit" value={trigger.chance} rows={1} onChange={(v) => onChange({ ...trigger, chance: v })} />
      <div className="sm:col-span-2">
        <Field label="Bedingung" value={trigger.condition} onChange={(v) => onChange({ ...trigger, condition: v })} />
      </div>
      <label className="flex items-center gap-2 font-sans text-sm">
        <input type="checkbox" checked={trigger.once} onChange={(e) => onChange({ ...trigger, once: e.target.checked })} />
        Einmalig
      </label>
      <button type="button" className="text-left font-sans text-[13px] text-mute" onClick={onRemove}>
        Trigger weg
      </button>
    </div>
  );
}

function GoalEdit({
  goal,
  onChange,
  onRemove,
}: {
  goal: QuestGoal;
  onChange: (g: QuestGoal) => void;
  onRemove: () => void;
}) {
  return (
    <div className="sm:col-span-2 grid gap-3 rounded-sm border border-line bg-card p-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Field label="Beschreibung" value={goal.text} onChange={(v) => onChange({ ...goal, text: v })} />
      </div>
      <Select label="Art" value={goal.kind} options={GOAL_KINDS} onChange={(v) => onChange({ ...goal, kind: v })} />
      <Field
        label="Fortschritt 0–100"
        value={String(goal.progress)}
        rows={1}
        onChange={(v) => onChange({ ...goal, progress: Math.max(0, Math.min(100, Number(v) || 0)) })}
      />
      <Field label="Erfolg" value={goal.success} onChange={(v) => onChange({ ...goal, success: v })} />
      <Field label="Scheitern" value={goal.fail} onChange={(v) => onChange({ ...goal, fail: v })} />
      <Field label="Belohnung dieses Ziels" value={goal.reward} onChange={(v) => onChange({ ...goal, reward: v })} />
      <label className="flex items-center gap-2 font-sans text-sm">
        <input type="checkbox" checked={goal.required} onChange={(e) => onChange({ ...goal, required: e.target.checked })} />
        Pflicht
      </label>
      <button type="button" className="text-left font-sans text-[13px] text-mute" onClick={onRemove}>
        Ziel weg
      </button>
    </div>
  );
}
