import { useEffect, useState } from "react";
import { getPlaceImageUrl } from "@/lib/photos";

export function PlaceImage({
  id,
  fallback,
  alt,
  className,
  revision = 0,
  local = true,
}: {
  id: string;
  fallback: string;
  alt: string;
  className?: string;
  revision?: number;
  local?: boolean;
}) {
  const [src, setSrc] = useState(fallback);
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    let dead = false;
    let objectUrl: string | null = null;
    setBroken(false);
    setSrc(fallback);
    if (!local) return;

    void getPlaceImageUrl(id, fallback).then((url) => {
      if (dead) {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
        return;
      }
      if (url.startsWith("blob:")) objectUrl = url;
      setSrc(url);
    });

    return () => {
      dead = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [id, fallback, revision, local]);

  if (broken) {
    return (
      <div
        className={
          "flex items-center justify-center bg-paper-2 font-sans text-sm text-mute " +
          (className || "min-h-40")
        }
      >
        Kein Bild
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => {
        if (src !== fallback) {
          setSrc(fallback);
          return;
        }
        setBroken(true);
      }}
    />
  );
}
