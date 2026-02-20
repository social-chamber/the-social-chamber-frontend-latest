import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="bg-[#D95900]">
      <div className="container mx-auto py-5 md:py-8 lg:py-[40px]">
        <h2 className="pb-[30px] md:pb-[38px] lg:pb-[48px] font-poppins text-center text-3xl md:text-[35px] lg:text-[40px] font-bold tracking-[0%] leading-[120%] text-white">
          How It Works
        </h2>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-[40px] md:gap-[80px] lg:gap-[120px] ">
          {/* Feature 1 - Positioned higher */}
          <div className="flex flex-col w-[353px] md:items-start  md:text-left md:self-start">
            <div className="flex items-center justify-between w-full mb-8 md:mb-12 lg:mb-[60px]">
              <span className="font-poppins text-xl md:text-2xl text-white font-normal leading-[120%] tracking-[0%]">
                01
              </span>
              <div className="">
                <Image
                  src="/images/home_trust.png"
                  alt="trust"
                  width={40}
                  height={40}
                  className="w-full h-10 object-cover"
                />
              </div>
            </div>
            <div className="pr-12">
              <h3 className="text-xl md:text-2xl lg:text-[32px] font-semibold font-poppins leading-[120%] tracking-[0%] text-white">
                You Can Trust
              </h3>
              <p className="text-base md:text-lg text-white font-normal font-poppins leadng-[120%] tracking-[0%] pt-[16px] md:pt-[20px] lg:pt-[26px]">
                You Can Trust is a reliable room booking service offering
                comfortable, affordable stays with a seamless reservation
                experience. Book with confidence your comfort is our priority.
              </p>
            </div>
          </div>

          {/* Feature 2 - Positioned lower */}
          <div className="flex flex-col  w-[353px] md:mt-16">
            <div className="flex items-center justify-between w-full mb-8 md:mb-12 lg:mb-[60px]">
              <span className="text-xl md:text-2xl text-white font-normal leading-[120%] font-poppins tracking-[0%]">
                02
              </span>
              <div className="">
                <Image
                  src="/images/home_fast.png"
                  alt="trust"
                  width={50}
                  height={40}
                  className="w-full h-10 object-cover"
                />
              </div>
            </div>
            <div className="pr-12">
              <h3 className="text-xl md:text-2xl lg:text-[32px] font-semibold font-poppins leading-[120%] tracking-[0%] text-white">
                Fast & Reliable
              </h3>
              <p className="text-base md:text-lg text-white font-normal font-poppins leadng-[120%] tracking-[0%] pt-[16px] md:pt-[20px] lg:pt-[26px]">
                Enjoy fast and reliable room booking with You Can Trust — secure
                your perfect stay in just a few clicks!.
              </p>
            </div>
          </div>

          {/* Feature 3 - Positioned higher */}
          <div className="flex flex-col  w-[353px]  ">
            <div className="flex  justify-between w-full mb-8 md:mb-12 lg:mb-[60px]">
              <span className="text-xl md:text-2xl text-white font-normal leading-[120%] font-poppins tracking-[0%]">
                03
              </span>
              <div className="">
                <Image
                  src="/images/home_safety.png"
                  alt="trust"
                  width={40}
                  height={40}
                  className="w-full h-10 object-cover"
                />
              </div>
            </div>
            <div className="pr-12">
              <h3 className="text-xl md:text-2xl lg:text-[32px] font-semibold font-poppins leading-[120%] tracking-[0%] text-white">
                Safety and Quality
              </h3>
              <p className="text-base md:text-lg text-white font-normal font-poppins leadng-[120%] tracking-[0%] pt-[16px] md:pt-[20px] lg:pt-[26px]">
                At You Can Trust, we prioritize safety and quality — offering
                clean, secure, and well-maintained rooms for a worry-free stay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
