import { hasTischPlay } from "@/lib/sicht";
import type { Place } from "@/lib/types";
import { useCatalog } from "@/lib/store";

export function PlacePills({ place }: { place: Place }) {
  const sl = useCatalog((s) => s.sicht) === "sl";
  if (!sl) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <span
        className={
          place.kern
            ? "rounded-full border border-pine/40 bg-card px-2.5 py-0.5 font-sans text-xs text-pine"
            : "rounded-full border border-gold/50 bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft"
        }
      >
        {place.kern ? "Kern" : "Erweiterung"}
      </span>
      {place.stand ? (
        <span className="rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft">
          {place.stand}
        </span>
      ) : null}
      {place.status_num !== "" && place.status_num != null ? (
        <span className="rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft">
          Status {place.status_num}
        </span>
      ) : null}
      {hasTischPlay(place) ? (
        <span className="rounded-full border border-accent/40 bg-[#f6ece4] px-2.5 py-0.5 font-sans text-xs text-accent">
          Spielbereit
        </span>
      ) : null}
      {place.keim ? (
        <span className="rounded-full border border-keim/40 bg-[#f6e6ec] px-2.5 py-0.5 font-sans text-xs text-keim">
          Keim {place.keim} still
        </span>
      ) : null}
      {place.typ ? (
        <span className="rounded-full border border-line bg-card px-2.5 py-0.5 font-sans text-xs text-ink-soft">
          {place.typ}
        </span>
      ) : null}
    </div>
  );
}
