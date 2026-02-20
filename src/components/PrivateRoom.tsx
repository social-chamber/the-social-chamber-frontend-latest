import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function PrivateRoomPromo() {
  return (
    <section className="w-full bg-[#FDB913]">
      <div className="container mx-auto py-[30px] md:py-[45px] lg:py-[60px] ">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-[120px]">
          {/* Image container - takes full width on mobile, half on larger screens */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div className="relative w-full max-w-[605px] lg:h-[315px]">
              <Image
                src="/img/img6.png"
                alt="Person stretching in a cozy room"
                width={605}
                height={315}
                className="object-cover w-full h-[315px]"
              />
            </div>
          </div>

          {/* Content container */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="font-poppins text-2xl md:text-3xl lg:text-[32px] font-semibold text-[#191919] tracking-[0%] leading-[120%] mb-4 md:mb-5 lg:mb-[30px]">
              Your Private Room. Your Experience. Anytime.
            </h2>

            <p className="text-base md:text-lg mb-8 md:mb-[40px] lg:mb-[60px] font-poppins leading-[120%] tracking-[0%] text-[#191919]">
              Unwind, connect, and celebrate in curated spaces for every mood — open 24/7 in the heart of Singapore.
            </p>

            <Button className="font-poppins bg-white hover:bg-gray-100 text-base text-[#FF6900] rounded-full px-6 md:px-8 py-3 md:py-4 font-medium">
              Reserve Your Experience Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
