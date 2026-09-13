import type { Place } from "@/lib/types";

const KEYS = ["sieht", "riecht", "wer", "szene"] as const;

/** Four table-facing facts. No rumors, no SL, no escalation. */
export function perceptionClues(place: Place): string[] {
  const out: string[] = [];
  for (const key of KEYS) {
    const v = place[key]?.trim();
    if (v) out.push(v);
  }
  if (out.length < 4 && place.spieltext?.trim()) {
    const extra = place.spieltext.trim();
    if (!out.includes(extra)) out.push(extra);
  }
  return out.slice(0, 4);
}

/** Success level 0–3 maps onto the four clues. Already-seen slots skip forward. */
export function pickClueIndex(sl: number, revealed: number[], total: number): number | null {
  if (total <= 0) return null;
  const start = Math.min(Math.max(0, sl), total - 1);
  for (let step = 0; step < total; step += 1) {
    const i = (start + step) % total;
    if (!revealed.includes(i)) return i;
  }
  return null;
}
