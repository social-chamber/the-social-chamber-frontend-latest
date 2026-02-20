"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import SmartVideo from "@/components/ui/smart-video";

export default function SocialSide() {
  const [isMobile, setIsMobile] = useState(false);
  const [videosToShow, setVideosToShow] = useState(3);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["contentVideo"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/assets?type=video&section=hero`
      );

      if (!res.ok) throw new Error("Network response was not ok");

      return res.json();
    },
  });

  const contentVideo = data?.data || [];

  // Handle load more click: simulate loading skeleton for 1s then increase count
  const handleLoadMore = () => {
    if (videosToShow >= contentVideo.length) return; // no more videos

    setLoadingMore(true);
    setTimeout(() => {
      setVideosToShow((prev) => Math.min(prev + 3, contentVideo.length));
      setLoadingMore(false);
    }, 1000); // simulate network/loading delay for skeleton
  };

  if (isLoading) return <p className="text-center">Loading videos...</p>;
  if (error) return <p className="text-center">Failed to load videos.</p>;

  const videosDisplayed = contentVideo.slice(0, videosToShow);

  // Skeleton component for loading placeholder
  const VideoSkeleton = () => (
    <div className="relative rounded-2xl overflow-hidden shadow-lg h-[500px] md:h-[600px] lg:h-[650px] bg-gray-300 animate-pulse" />
  );

  return (
    <section className="container mx-auto py-[60px] md:py-[100px] lg:py-[150px]">
      <h1 className="text-3xl md:text-4xl lg:text-[40px] font-semibold font-poppins text-center tracking-[0%] text-[#FF6900] mb-10 md:mb-12 lg:pb-[60px]">
        Join the Social Side
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px] md:gap-[45px] lg:gap-[60px]">
        {videosDisplayed.map((video: any) => (
          <div
            key={video._id}
            className="relative rounded-2xl overflow-hidden shadow-lg h-[500px] md:h-[600px] lg:h-[650px]"
          >
            <div
              className={`${
                isMobile
                  ? "w-full h-full"
                  : "h-full flex items-center justify-center"
              }`}
            >
              <div
                className={`${isMobile ? "" : "w-[456px] h-[707px] rounded-[20px] overflow-hidden"}`}
              >
                <SmartVideo
                  className="w-full h-full object-cover"
                  width={456}
                  height={707}
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={video.url}
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-manrope text-white text-lg font-bold leading-[120%] tracking-[0%] pl-4 md:pl-6 lg:pl-8 ">
                {video.authorName || "Albert Flores"}
              </h3>
              <p className="text-sm font-normal font-manrope leading-[120%] text-[#D4D4D8] pt-[5px] pl-4 md:pl-6 lg:pl-8 pb-4 md:pb-6 lg:pb-8">
                {video.authorTitle || "Founder"}
              </p>
            </div>
          </div>
        ))}

        {/* Show skeletons if loading more */}
        {loadingMore &&
          Array(3)
            .fill(0)
            .map((_, idx) => <VideoSkeleton key={`skeleton-${idx}`} />)}
      </div>

      <div className="flex justify-center mt-8 md:mt-12 lg:mt-[60px]">
        {/* Disable button if no more videos */}
        <button
          onClick={handleLoadMore}
          disabled={loadingMore || videosToShow >= contentVideo.length}
          className={`font-poppins bg-[#FF6B00] hover:bg-[#E05F00] text-white font-medium py-3 md:py-4 px-6 md:px-8 rounded-full leading-[120%] tracking-[0%] transition-colors duration-300 ${
            loadingMore || videosToShow >= contentVideo.length
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {videosToShow >= contentVideo.length
            ? "No More Videos"
            : "Reserve Now"}
        </button>
      </div>
    </section>
  );
}
