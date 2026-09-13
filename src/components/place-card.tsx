import { Link } from "@tanstack/react-router";
import { PlaceImage } from "@/components/place-image";
import { PlacePills } from "@/components/pills";
import { displayName, photoSrc, tableTeaser } from "@/lib/catalog";
import { useCatalog } from "@/lib/store";
import type { Place } from "@/lib/types";

export function PlaceCard({ place }: { place: Place }) {
  const sl = useCatalog((s) => s.sicht) === "sl";
  const teaser = tableTeaser(place);

  return (
    <Link
      to="/ort/$id"
      params={{ id: String(place.id) }}
      className="card-lift group block text-ink no-underline"
    >
      <div className="plate">
        <div className="overflow-hidden">
          <PlaceImage
            id={place.id}
            fallback={photoSrc(place)}
            alt={displayName(place)}
            className="h-44 w-full object-cover transition-transform duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
        </div>
        <div className="px-1.5 pb-1.5 pt-3">
          {sl ? (
            <div className="font-sans text-[11px] tabular-nums tracking-wide text-mute">{place.id}</div>
          ) : null}
          <h3 className="m-0 font-serif text-lg leading-snug">{displayName(place)}</h3>
          {sl ? (
            <div className="mt-2">
              <PlacePills place={place} />
            </div>
          ) : null}
          {sl && teaser ? <p className="mt-2 text-sm leading-relaxed text-ink-soft">{teaser}</p> : null}
        </div>
      </div>
    </Link>
  );
}
