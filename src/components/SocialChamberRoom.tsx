"use client";

import type React from "react";
import { useQuery } from "@tanstack/react-query";
import SmartImage from "@/components/ui/smart-image";
import SmartVideo from "@/components/ui/smart-video";
import { useState, useRef, useEffect } from "react";
import { Play, Eye, Loader2 } from "lucide-react";
import SocialChamberLayout from "./social-chamber-layout";

export function VideoPlayer({ data }: { data: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !error) {
            video.play().catch(() => setError(true));
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [error]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && !error) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => setError(true));
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100  cursor-pointer"
      style={{ height: "285px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <div className="text-center text-gray-500">
            <Play className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Video unavailable</p>
          </div>
        </div>
      ) : (
        <SmartVideo
          // @ts-expect-error: SmartVideo does not accept ref prop, but we need it for video control
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
          src={data.url}
        />
      )}

      {isLoading && !error && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      )}

      {!error && (
        <div
          className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}
          onClick={togglePlay}
        >
          {!isPlaying && (
            <Play
              className="w-10 h-10 text-white drop-shadow-lg"
              fill="white"
            />
          )}
        </div>
      )}
    </div>
  );
}

export function ImageItem({ data, index }: { data: any; index: number }) {
  // const [, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-lg bg-gray-100 flex-shrink-0 cursor-pointer"
      style={{height: "285px" }}
      // onMouseEnter={() => setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded" />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      ) : (
        <div className="relative h-[285px] w-full">
          <SmartImage
          fill
          src={data.url || "/placeholder.svg"}
          alt={`Room Image ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
        />
          </div>
      )}

      {isLoading && !error && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
    </div>
  );
}

export default function SocialChamberRoom() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["galleryImage"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/assets?type=image&type=video&section=gallery`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const items = data?.data || [];

  return (
    <div className="w-full container max-w-none mx-auto md:px-28 md:py-10 text-center overflow-x-hidden">
      <h2 className="text-2xl md:text-4xl font-bold text-orange-600 mb-10">
        The Social Chamber Room
      </h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        </div>
      ) : error ? (
        <div className="py-20">
          <p className="text-red-500 mb-4">Error loading gallery</p>
          <button
            onClick={() => refetch()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Try Again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20">
          <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No gallery items found</p>
          <button
            onClick={() => refetch()}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Reload Gallery
          </button>
        </div>
      ) : (
        <SocialChamberLayout />
      )}
      
      <button className="mt-10 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
        Reserve Now →
      </button>
    </div>
  );
}
