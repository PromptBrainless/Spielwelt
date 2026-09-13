import type { Place } from "@/lib/types";

/** Handout copy. No catalog field names. */
export function PlaceProse({ place }: { place: Place }) {
  const body = (place.spieltext || place.sieht || "").trim();
  const smell = place.riecht?.trim();
  const who = place.wer?.trim();
  const scene = place.szene?.trim();

  if (!body && !smell && !who && !scene) return null;

  return (
    <div className="mt-6 max-w-[62ch]">
      {body ? (
        <p className="whitespace-pre-wrap text-[19px] leading-[1.55]">{body}</p>
      ) : null}
      {smell ? <p className="mt-5 italic leading-relaxed text-ink-soft">{smell}</p> : null}
      {who ? <p className="mt-5 leading-relaxed">{who}</p> : null}
      {scene ? (
        <>
          <div className="ornament my-7" aria-hidden>
            <span />
          </div>
          <p className="whitespace-pre-wrap text-[17px] leading-relaxed">{scene}</p>
        </>
      ) : null}
    </div>
  );
}
