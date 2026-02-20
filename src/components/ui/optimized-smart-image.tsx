"use client";

import Image, { ImageProps } from "next/image";
import { useMemo, useState, useCallback } from "react";

type OptimizedSmartImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  priority?: boolean;
  sizes?: string;
};

// Cache successful image sources to avoid retries
const imageCache = new Map<string, string>();

function isAbsoluteUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function OptimizedSmartImage({ 
  src, 
  alt, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...rest 
}: OptimizedSmartImageProps) {
  const candidateSources = useMemo(() => {
    // Check cache first
    if (src && imageCache.has(src)) {
      return [imageCache.get(src)!];
    }

    const list: string[] = [];
    const cloudinaryBase = process.env.NEXT_PUBLIC_CLOUDINARY_BASE || "";
    const multerBase = process.env.NEXT_PUBLIC_IMAGE_BASE || "";

    if (src && src.length > 0) {
      // Prioritize the most likely sources first
      if (isAbsoluteUrl(src) || src.startsWith("/")) {
        list.push(src);
      } else {
        // Try local public folder first (fastest)
        list.push(`/img/all/${src}`);
        
        // Then try external sources
        if (cloudinaryBase) {
          list.push(`${cloudinaryBase}${src}`);
        }
        if (multerBase) {
          list.push(`${multerBase}${src}`);
        }
      }
    }

    // Add fallback
    list.push("/placeholder.svg");
    
    return Array.from(new Set(list));
  }, [src]);

  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentSrc = candidateSources[Math.min(index, candidateSources.length - 1)];

  const handleError = useCallback(() => {
    if (index + 1 < candidateSources.length) {
      setIndex(i => i + 1);
    }
  }, [index, candidateSources.length]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    // Cache successful source
    if (src) {
      imageCache.set(src, currentSrc);
    }
  }, [src, currentSrc]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <Image
        {...rest}
        alt={alt}
        src={currentSrc}
        priority={priority}
        sizes={sizes}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}
