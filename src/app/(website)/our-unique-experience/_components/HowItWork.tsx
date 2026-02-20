import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function HowItWorks() {
  return (
    <section className="pb-[40px] md:pb-[70px] lg:pb-[100px]">
      <div className="container mx-auto pt-[40px] md:pt-[70px] lg:pt-[99px]">

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-[40px] md:gap-[80px] lg:gap-[120px] py-5 md:py-8 lg:py-[40px]">
          {/* Feature 1 - Positioned higher */}
          <div className="flex flex-col w-[353px] md:items-start  md:text-left md:self-start">
            <div className="flex items-center justify-between w-full mb-8 md:mb-12 lg:mb-[60px]">
              <span className="text-xl md:text-2xl text-black font-normal leading-[120%] font-poppins tracking-[0%]">01</span>
              <div className="">
                <Image src="/images/trust.png" alt="trust" width={40} height={40} className="w-full h-10 object-cover"/>
              </div>
            </div>
          <div className="pr-12">
          <h3 className="text-xl md:text-2xl lg:text-[32px] font-semibold font-poppins leading-[120%] tracking-[0%] text-black">You Can Trust</h3>
            <p className="text-base md:text-lg text-black font-normal font-poppins leadng-[120%] tracking-[0%] pt-[16px] md:pt-[20px] lg:pt-[26px]">
            You Can Trust is a reliable room booking service offering comfortable, affordable stays with a seamless reservation experience. Book with confidence your comfort is our priority.
            </p>
          </div>
          </div>

          {/* Feature 2 - Positioned lower */}
          <div className="flex flex-col  w-[353px] md:mt-16">
            <div className="flex items-center justify-between w-full mb-8 md:mb-12 lg:mb-[60px]">
              <span className="text-xl md:text-2xl text-black font-normal leading-[120%] font-poppins tracking-[0%]">02</span>
              <div className="">
                <Image src="/images/fast.png" alt="trust" width={50} height={40} className="w-full h-10 object-cover"/>
              </div>
            </div>
            <div className="pr-12">
            <h3 className="text-xl md:text-2xl lg:text-[32px] font-semibold font-poppins leading-[120%] tracking-[0%] text-black">Fast & Reliable</h3>
            <p className="text-base md:text-lg text-black font-normal font-poppins leadng-[120%] tracking-[0%] pt-[16px] md:pt-[20px] lg:pt-[26px]">
              Enjoy fast and reliable room booking with You Can Trust — secure your perfect stay in just a few clicks!
            </p>
            </div>
          </div>

          {/* Feature 3 - Positioned higher */}
          <div className="flex flex-col  w-[353px]  ">
            <div className="flex  justify-between w-full mb-8 md:mb-12 lg:mb-[60px]">
              <span className="text-xl md:text-2xl text-black font-normal leading-[120%] font-poppins tracking-[0%]">03</span>
              <div className="">
                <Image src="/images/safety.png" alt="trust" width={40} height={40} className="w-full h-10 object-cover"/>
              </div>
            </div>
          <div className="pr-12">
          <h3 className="text-xl md:text-2xl lg:text-[32px] font-semibold font-poppins leading-[120%] tracking-[0%] text-black">Safety and Quality</h3>
            <p className="text-base md:text-lg text-black font-normal font-poppins leadng-[120%] tracking-[0%] pt-[16px] md:pt-[20px] lg:pt-[26px]">
           At You Can Trust, we prioritize safety and quality — offering clean, secure, and well-maintained rooms for a worry-free stay.
            </p>
          </div>
          </div>

          
        </div>
        {/* button  */}
          <div className="w-full flex items-center justify-center pt-[40px] md:pt-[70px] lg:pt-[99px]">
            <button className="w-full md:w-[385px] flex items-center gap-2 bg-[#FF6900] rounded-[8px] py-3 md:py-4 px-6 md:px-8 text-base font-medium text-white font-poppins tracking-[0%] leading-[120%]">Click here to view pricing/Packages <ArrowRight /></button>
          </div>
      </div>
    </section>
  )
}
