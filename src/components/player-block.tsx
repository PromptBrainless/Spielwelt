import type { Place } from "@/lib/types";

/** What the group has as soon as they are there. No roll. */
export function PlayerBlock({ place }: { place: Place }) {
  const ankunft = place.spieltext?.trim();
  const sieht = place.sieht?.trim();
  const riecht = place.riecht?.trim();
  const wer = place.wer?.trim();
  if (!ankunft && !sieht && !riecht && !wer) return null;

  return (
    <div className="mt-6 max-w-[62ch] space-y-5">
      {ankunft ? (
        <section className="box-read">
          <div className="kicker text-accent">Ankunft</div>
          <p className="mt-2 whitespace-pre-wrap text-[17px] leading-relaxed">{ankunft}</p>
        </section>
      ) : null}
      {sieht ? (
        <div>
          <div className="kicker">Man sieht</div>
          <p className="mt-1 leading-relaxed">{sieht}</p>
        </div>
      ) : null}
      {riecht ? (
        <div>
          <div className="kicker">Man riecht</div>
          <p className="mt-1 leading-relaxed">{riecht}</p>
        </div>
      ) : null}
      {wer ? (
        <div>
          <div className="kicker">Wer hier ist</div>
          <p className="mt-1 leading-relaxed">{wer}</p>
        </div>
      ) : null}
    </div>
  );
}
