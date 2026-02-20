"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function StaticSlider() {
  const slides = [
    {
      id: 1,
      image: "/img/exp1.png",
      title: "1. Place Made Just for You and Your Love One",
      subtitle: "No CCTV, No Disturbance!",
      description:
        "Create COZY moments together with your friends/date. A truly private immersive cinematic room",
    },
    {
      id: 2,
      image: "/img/img1.jpg",
      title: "1. Private Movie Room Experience",
      subtitle: "No CCTV, No Disturbance!",
      description:
        "Create COZY moments together with your friends/date. A truly private immersive cinematic room",
    },
    {
      id: 3,
      image: "/img/exp2.png",
      title: "2. HUGE place for group gathering",
      subtitle: "No CCTV, No Disturbance!",
      description:
        "Create COZY moments together with your friends/date. A truly private immersive cinematic room",
    },
  ];

  return (
    <div className="w-full py-10 px-4">
      <div className="flex flex-col lg:flex-row items-end justify-center gap-4 lg:gap-6  mx-auto">
        {/* Left Card - Smaller */}
        <div className="w-full ">
          <Card className="rounded-2xl shadow-lg overflow-hidden bg-[#F8F8F8] h-[500px]">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="relative w-full flex-1 rounded-2xl overflow-hidden">
                <Image
                  src={slides[1].image || "/placeholder.svg"}
                  alt={slides[1].title}
                  fill
                  quality={90}
                  sizes="280px"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 space-y-1 text-center">
                <h2 className="text-sm font-semibold text-[#FF6900] leading-tight">
                  {slides[0].title}
                </h2>
                <p className="text-xs text-gray-700">{slides[0].subtitle}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {slides[0].description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle Card - Much Larger */}
        <div className="w-full ">
          <Card className="rounded-2xl shadow-lg overflow-hidden bg-[#F8F8F8] h-[570px]">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="relative w-full flex-1 rounded-2xl overflow-hidden">
                <Image
                  src={slides[0].image || "/placeholder.svg"}
                  alt={slides[0].title}
                  fill
                  quality={90}
                  sizes="380px"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 space-y-2 text-center">
                <h2 className="text-xl font-semibold text-[#FF6900] leading-tight">
                  {slides[1].title}
                </h2>
                <p className="text-sm text-gray-700">{slides[1].subtitle}</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {slides[1].description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Card - Smaller */}
        <div className="w-full ">
          <Card className="rounded-2xl shadow-lg overflow-hidden bg-[#F8F8F8] h-[500px]">
            <CardContent className="p-4 flex flex-col h-full">
              <div className="relative w-full flex-1 rounded-2xl overflow-hidden">
                <Image
                  src={slides[2].image || "/placeholder.svg"}
                  alt={slides[2].title}
                  fill
                  quality={90}
                  sizes="280px"
                  className="object-cover"
                />
              </div>
              <div className="mt-3 space-y-1 text-center">
                <h2 className="text-sm font-semibold text-[#FF6900] leading-tight">
                  {slides[2].title}
                </h2>
                <p className="text-xs text-gray-700">{slides[2].subtitle}</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {slides[2].description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
