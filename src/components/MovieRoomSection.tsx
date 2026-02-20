"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, ArrowRight } from "lucide-react";

export default function MovieRoomSection() {
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
    <section className="container mx-auto py-10 md:py-[70px] lg:py-[100px]">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-poppins text-2xl md:text-[28px] lg:text-[32px] font-semibold text-[#FF6900] leading-[120%] tracking-[0%] mb-6 md:mb-8 lg:mb-10">
          PRIVATE MOVIE ROOM DATE IDEA
        </h2>

        <p className="text-lg md:text-xl 2xl:text-2xl text-black font-normal leading-[120%] tracking-[0%] font-poppins pb-6 md:pb-8 lg:pb-10">
          Looking for a private space to watch movie/series with your date
        </p>

        <button
          className="bg-[#FF6900] hover:bg-[#E55500] text-white font-medium leading-[120%] font-poppins tracking-[0%] px-6 md:px-8 py-3 lg:py-4 rounded-md flex items-center gap-2 mb-10 md:mb-16 lg:mb-[100px]"
          onClick={() => window.open("#pricing", "_self")}
        >
          Click here to view pricing/packages
          <ArrowRight />
        </button>

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
            A Private Space Made Just for You and Your
            Love One
          </div>
        </div>
      </div>
    </section>
  );
}
