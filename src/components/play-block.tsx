import { hasTischPlay } from "@/lib/sicht";
import type { Place } from "@/lib/types";

export function PlayBlock({ place }: { place: Place }) {
  if (!hasTischPlay(place) && !place.eskalation) return null;

  return (
    <div className="mt-6 space-y-4">
      {place.spieltext ? (
        <section className="box-read">
          <div className="kicker text-accent">Vorlesen</div>
          <p className="mt-2 whitespace-pre-wrap text-[17px] leading-relaxed">{place.spieltext}</p>
        </section>
      ) : null}
      {place.spielkern ? (
        <p className="text-[15px] leading-relaxed text-ink-soft">{place.spielkern}</p>
      ) : null}
      {place.szene ? (
        <section>
          <div className="kicker">Wenn sie ankommen</div>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{place.szene}</p>
        </section>
      ) : null}
      {place.eskalation ? (
        <section>
          <div className="kicker">Gespräch</div>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed">{place.eskalation}</p>
        </section>
      ) : null}
    </div>
  );
}
