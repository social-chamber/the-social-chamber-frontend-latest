"use client";

import { useMemo, useRef, useState } from "react";

type SmartVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src?: string | null;
};

function isAbsoluteUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function buildAbsoluteCandidates(src: string): string[] {
  const candidates: string[] = [];
  try {
    const u = new URL(src);
    const parts = u.pathname.split("/");
    const file = parts.pop() || "";
    const dir = parts.join("/");
    const originDir = `${u.origin}${dir ? "/" + dir : ""}`;

    candidates.push(src);

    const lower = file.toLowerCase();
    const known = ["mp4"];
    const lastDot = lower.lastIndexOf(".");
    const ext = lastDot >= 0 ? lower.slice(lastDot + 1) : "";

    // Try remove duplicate extension like .mp4.mp4
    if (ext && lower.endsWith(`.${ext}.${ext}`)) {
      const single = file.slice(0, file.length - (ext.length + 1));
      candidates.push(`${originDir}/${single}`);
    }

    // Try alternate extension variations from base
    const base = lastDot >= 0 ? file.slice(0, lastDot) : file;
    known.forEach((k) => candidates.push(`${originDir}/${base}.${k}`));
  } catch {
    // ignore
  }
  return candidates;
}

export default function SmartVideo({ src, ...rest }: SmartVideoProps) {
  const candidateSources = useMemo(() => {
    const list: string[] = [];
    const cloudinaryBase = process.env.NEXT_PUBLIC_CLOUDINARY_BASE || "";

    if (src && src.length > 0) {
      if (isAbsoluteUrl(src)) {
        list.push(...buildAbsoluteCandidates(src));
      } else {
        // local/public
        list.push(`/img/all/${src}`);

        // cloudinary base
        if (cloudinaryBase) {
          list.push(`${cloudinaryBase}${src}`);
        }

        // Strip extension and try variations
        const lastDot = src.lastIndexOf(".");
        const ext = lastDot >= 0 ? src.slice(lastDot + 1).toLowerCase() : "";
        const base = lastDot >= 0 ? src.slice(0, lastDot) : src;

        const isDup = ext && src.toLowerCase().endsWith(`.${ext}.${ext}`);
        if (isDup) {
          const single = src.slice(0, src.length - (ext.length + 1));
          list.push(`/img/all/${single}`);
          if (cloudinaryBase) list.push(`${cloudinaryBase}${single}`);
        }

        const variants = ["mp4"];
        variants.forEach((k) => {
          if (cloudinaryBase) list.push(`${cloudinaryBase}${base}.${k}`);
          list.push(`/img/all/${base}.${k}`);
        });
      }
    }

    // final fallback local demo asset
    list.push("/img/movieRoom.mp4");

    // dedupe
    return Array.from(new Set(list));
  }, [src]);

  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentSrc = candidateSources[Math.min(index, candidateSources.length - 1)];

  return (
    <video
      {...rest}
      ref={videoRef}
      key={currentSrc}
      onError={() => {
        setIndex((i) => (i + 1 < candidateSources.length ? i + 1 : i));
      }}
      src={currentSrc}
    >
      <source src={currentSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}


