"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

export default function RoomGallery() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const galleryItems = [
  
    {
      id: 1,
      title: "1. Private Movie Room Experience",
      image:
        "/img/exp1.png",
      alt: "Couple enjoying movie night with drinks and popcorn",
    },
    {
        id: 2,
        title: "2. HUGE place for group gathering",
        image:
          "/img/exp2.png",
        alt: "Group of friends in a themed room with decorative banners",
      },
    {
      id: 3,
      title: "3. A Private Space Made Just for You and Your Love One",
      image:
        "/img/exp3.png",
      alt: "Couple sharing a moment in a cozy living room",
    },
  ]

  return (
    <div className="w-full">
    <div className="flex flex-col gap-8 md:gap-[45px] lg:gap-[60px] ">
      {galleryItems.map((item) => (
        <div key={item.id} className={`w-full ${item.id === 1 || item.id === 3 ? "bg-[#E4E4E4]" : "bg-white"}`}>
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-[70px] lg:py-[100px] ">
            <h2 className="text-xl md:text-2xl font-medium text-[#FF6900] font-poppins leading-[120%] tracking-[0%] mb-6 md:mb-9 lg:mb-[50px]">{item.title}</h2>
            <div className="relative w-full overflow-hidden rounded-lg md:rounded-xl">
              <div className="w-full aspect-[16/9] md:aspect-[16/9] lg:aspect-auto relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.alt}
                  fill={isMobile || isTablet}
                  width={isMobile || isTablet ? undefined : 1288}
                  height={isMobile || isTablet ? undefined : 718}
                  className={`object-cover ${isMobile || isTablet ? "object-center" : ""} rounded-lg md:rounded-xl`}
                  priority={item.id === 2} // Prioritize loading the first visible image
                />
              </div>
            </div>
            <div className="mt-[20px] md:mt-[35px] lg:mt-[50px]">
              <p className="text-base md:text-lg font-normal font-poppins leading-[120%] tracking-[0%] text-black">No CCTV, No Disturbance!</p>
              <p className="text-base md:text-lg font-normal font-poppins leading-[120%] tracking-[0%] text-black py-2 md:py-3 lg:py-4">Create COZY moments together with your friends/date.</p>
              <p className="text-base md:text-lg font-normal font-poppins leading-[120%] tracking-[0%] text-black">A truly private immersive cinematic room</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}
