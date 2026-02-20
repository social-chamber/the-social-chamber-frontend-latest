"use client";

import Image, { ImageProps } from "next/image";
import { useMemo, useState } from "react";

type SmartImageProps = Omit<ImageProps, "src"> & {
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

function getBasenameWithoutExt(path: string): string {
  const lastSlash = path.lastIndexOf("/");
  const file = lastSlash >= 0 ? path.slice(lastSlash + 1) : path;
  const lastDot = file.lastIndexOf(".");
  return lastDot >= 0 ? file.slice(0, lastDot) : file;
}

export default function SmartImage({ src, alt, ...rest }: SmartImageProps) {
  const candidateSources = useMemo(() => {
    const list: string[] = [];
    const cloudinaryBase = process.env.NEXT_PUBLIC_CLOUDINARY_BASE || "";
    const multerBase = process.env.NEXT_PUBLIC_IMAGE_BASE || ""; // e.g., https://api.example.com/uploads/

    if (src && src.length > 0) {
      // If absolute or already rooted path, try it first
      if (isAbsoluteUrl(src) || src.startsWith("/")) {
        list.push(src);
        // try removing duplicate extension for absolute URLs and add multer fallbacks by basename
        try {
          const u = new URL(src, typeof window !== "undefined" ? window.location.origin : "http://localhost");
          const parts = u.pathname.split("/");
          const file = parts.pop() || "";
          const dir = parts.join("/");
          const lastDot = file.lastIndexOf(".");
          const originDir = `${u.origin}${dir ? "/" + dir : ""}`;
          let base = file;
          if (lastDot >= 0) {
            const ext = file.slice(lastDot + 1).toLowerCase();
            const lower = file.toLowerCase();
            base = file.slice(0, lastDot);
            if (ext && lower.endsWith(`.${ext}.${ext}`)) {
              const single = file.slice(0, file.length - (ext.length + 1));
              list.push(`${originDir}/${single}`);
              base = single.slice(0, single.lastIndexOf(".")) || single;
            }
          }
          // If multer base is provided, try basename with common extensions
          if (multerBase) {
            list.push(`${multerBase}${base}.webp`);
            list.push(`${multerBase}${base}.jpeg`);
            list.push(`${multerBase}${base}.jpg`);
            list.push(`${multerBase}${base}.png`);
          }
          // Also try local public fallback by basename
          list.push(`/img/all/${base}.webp`);
          list.push(`/img/all/${base}.jpeg`);
          list.push(`/img/all/${base}.jpg`);
          list.push(`/img/all/${base}.png`);
        } catch {
          // ignore
        }
      } else {
        // Treat as filename, build from our public folder
        list.push(`/img/all/${src}`);

        // If Cloudinary base is provided, try that too
        if (cloudinaryBase) {
          // as-is
          list.push(`${cloudinaryBase}${src}`);
        }
        // If backend (multer) base is provided, try that
        if (multerBase) {
          list.push(`${multerBase}${src}`);
        }
      }

      // Build fallback variants from basename
      const base = getBasenameWithoutExt(src);
      // If src had a duplicate extension (e.g., .jpg.jpg), also try the single-ext filename
      const lastDot = src.lastIndexOf(".");
      if (lastDot >= 0) {
        const ext = src.slice(lastDot + 1).toLowerCase();
        const lower = src.toLowerCase();
        if (ext && lower.endsWith(`.${ext}.${ext}`)) {
          const single = src.slice(0, src.length - (ext.length + 1));
          list.push(`/img/all/${single}`);
          if (cloudinaryBase) list.push(`${cloudinaryBase}${single}`);
        }
      }
      if (cloudinaryBase) {
        list.push(`${cloudinaryBase}${base}.webp`);
        list.push(`${cloudinaryBase}${base}.jpeg`);
        list.push(`${cloudinaryBase}${base}.jpg`);
        list.push(`${cloudinaryBase}${base}.png`);
      }
      if (multerBase) {
        list.push(`${multerBase}${base}.webp`);
        list.push(`${multerBase}${base}.jpeg`);
        list.push(`${multerBase}${base}.jpg`);
        list.push(`${multerBase}${base}.png`);
      }
      list.push(`/img/all/${base}.webp`);
      list.push(`/img/all/${base}.jpeg`);
      list.push(`/img/all/${base}.jpg`);
      list.push(`/img/all/${base}.png`);
    }

    // Final fallback
    list.push("/placeholder.svg");
    
    // Deduplicate while preserving order
    return Array.from(new Set(list));
  }, [src]);

  const [index, setIndex] = useState(0);

  const currentSrc = candidateSources[Math.min(index, candidateSources.length - 1)];

  return (
    <Image
      {...rest}
      alt={alt}
      src={currentSrc}
      onError={() => {
        setIndex((i) => (i + 1 < candidateSources.length ? i + 1 : i));
      }}
    />
  );
}


