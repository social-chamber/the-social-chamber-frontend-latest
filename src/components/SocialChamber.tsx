"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export default function SocialChamber() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 lg:pt-[75px]">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-poppins text-2xl md:text-[28px] lg:text-[32px] font-semibold text-[#FF6900] leading-[120%] tracking-[0%] mb-[25px] md:pb-[40px] lg:pb-[54px]">
          The Social Chamber Difference
        </h2>

        <div className="w-full max-w-[984px] mx-auto relative rounded-lg overflow-hidden shadow-sm">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-[8px]"
              // poster="/cozy-movie-room.png"
              preload="metadata"
              width={984}
              height={548}
            >
              <source src="/img/movieRoom.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video overlay with controls */}
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-[8px]">
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-[#E4E4E4] py-4 md:py-5 lg:py-6 px-3 md:px-4 text-lg text-[#FF6900] font-semibold text-left font-poppins rounded-b-[8px]">
            A Private Space Made Just for You and Your Love One
          </div>
        </div>
      </div>
    </section>
  );
}
