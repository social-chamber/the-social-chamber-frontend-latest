"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [activeTab, setActiveTab] = useState("hourly");

  return (
    <section className="w-full pt-[40px] md:pt-[70px] lg:pt-[100px]">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left side content */}
          <div className="w-full lg:w-1/2">
            <h2 className="w-[444px] text-2xl md:text-3xl lg:text-[32px] leading-[120%] tracking-[120%] text-center font-semibold text-[#FF6900] font-poppins pb-4 md:pb-7 lg:pb-10">
              Pricing
            </h2>

            {/* Peak and Non-Peak hours info */}
            <div className="w-full md:w-[444px] pb-[30px] md:pb-[50px] lg:pb-[70px]">
              <div className="pb-4 md:pb-6 lg:pb-8">
                <h3 className="font-semibold text-xl text-center leading-[120%] tracking-[0%] font-poppins pb-2 md:pb-3 lg:pb-4">
                  Non Peak
                </h3>
                <p className="text-lg text-center italic font-medium leading-[120%] tracking-[0%] text-black font-poppins">
                  Fri: 11am to 7pm (Exclude PH.)
                </p>
                <p className="text-lg text-center italic font-medium leading-[120%] tracking-[0%] text-black pt-2 font-poppins">
                  Mon - Thurs: 11am to 11pm (Exclude PH & PH eve)
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-xl text-center leading-[120%] tracking-[0%] font-poppins pb-2 md:pb-3 lg:pb-4">
                  Peak
                </h3>
                <p className="text-lg text-center italic font-medium leading-[120%] tracking-[0%] text-black font-poppins">
                  Fri & PH eve: 7pm 11pm
                </p>
                <p className="text-lg text-center italic font-medium leading-[120%] tracking-[0%] text-black pt-2 font-poppins">
                  Sat, Sun & PH: 11am to 11pm
                </p>
              </div>
            </div>

            {/* Tabs for Hourly and Packages */}
            <Tabs
              defaultValue="hourly"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full "
            >
              <TabsList className="grid grid-cols-2 w-full bg-white">
                <TabsTrigger
                  value="hourly"
                  className={cn(
                    "font-poppins text-xl !shadow-none !outline-none !rounded-none w-full flex items-center justify-start",
                    activeTab === "hourly"
                      ? "w-[100px] !text-[#D95900] border-b-[2px] font-semibold border-[#D95900]"
                      : "text-black font-normal"
                  )}
                >
                  Hourly
                </TabsTrigger>
                <TabsTrigger
                  value="packages"
                  className={cn(
                    "font-poppins text-xl !shadow-none !outline-none !rounded-none w-full flex items-center justify-start",
                    activeTab === "packages"
                      ? "w-[220px] !text-[#D95900] border-b-[2px] font-semibold border-[#D95900]"
                      : "text-black font-normal"
                  )}
                >
                  Packages Available
                </TabsTrigger>
              </TabsList>

              {/* Hourly rates content */}
              <TabsContent
                value="hourly"
                className="pt-[25px] md:pt-[32px] lg:pt-[40px]"
              >
                <div className="">
                  <div className="">
                    <h4 className="font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black">
                      <span className="font-semibold">Early Bird: $6.90</span>{" "}
                      /pax
                    </h4>
                    <p className="text-lg md:text-xl font-normal font-poppins leading-[120%] pt-2 md:pt-3 tracking-[0%]">
                      Weekdays (9am - 12pm)
                    </p>
                  </div>

                  <div className="py-[20px] md:py-[26px] lg:py-[32px]">
                    <h4 className="font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black">
                      Peak: $12.90{" "}
                      <span className="font-semibold">Early Bird: $6.90</span>
                    </h4>
                    <p className="py-[10px] md:py-[13px] lg:py-[15px] text-lg md:text-xl font-normal font-poppins leading-[120%] tracking-[0%]">
                      Friday (6pm – 12am)
                    </p>
                    <p className="text-lg md:text-xl font-normal font-poppins leading-[120%] tracking-[0%]">
                      Saturday to Sunday (12am – 12am)
                    </p>
                  </div>

                  <div className="">
                    <h4 className="font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black">
                      Non Peak: $10.90{" "}
                      <span className="font-semibold">Early Bird: $6.90</span>
                    </h4>
                    <p className="py-[10px] md:py-[13px] lg:py-[15px] text-lg md:text-xl font-normal font-poppins leading-[120%] tracking-[0%]">
                      Monday to Thursday (12am – 12am)
                    </p>
                    <p className="text-lg md:text-xl font-normal font-poppins leading-[120%] tracking-[0%]">
                      Friday (12am – 6pm)
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Packages content */}
              <TabsContent value="packages" className="space-y-6 mt-6">
                <div className="">
                  <div className="">
                    <h3 className="text-center font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black font-medium italic pb-4 md:pb-5">Early Bird Packages</h3>
                    <h4 className="font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black">
                      <span className="font-semibold">Daypass: $18.5</span>{" "}
                      /pax
                    </h4>
                    <p className="text-lg md:text-xl font-normal font-poppins leading-[120%] pt-2 md:pt-3 tracking-[0%]">
                      Weekdays (9am - 12pm)
                    </p>
                    <h4 className="font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black pt-4 md:pt-6">
                      <span className="font-semibold">Noonpass: $29 </span>{" "}
                      (for 3hrs) /pax
                    </h4>
                    <p className="text-lg md:text-xl font-normal font-poppins leading-[120%] pt-2 md:pt-3 tracking-[0%]">
                      Weekdays (9am - 12pm)
                    </p>
                  </div>
                  <div className="">
                    <h3 className="text-center font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black font-medium italic py-4 md:py-5">Midnight Packages</h3>
                    <h4 className="font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black">
                      <span className="font-semibold">Peak: $59 </span>{" "}
                      /pax
                    </h4>
                    <p className="text-lg md:text-xl font-normal font-poppins leading-[120%] pt-2 md:pt-3 tracking-[0%]">
                     Saturday to Sunday (12am — 9am)
                    </p>
                    <h4 className="font-poppins text-lg md:text-xl leading-[120%] tracking-[0%] text-black pt-4 md:pt-6">
                      <span className="font-semibold">Non Peak: $40.90 </span> /pax
                    </h4>
                    <p className="text-lg md:text-xl font-normal font-poppins leading-[120%] pt-2 md:pt-3 tracking-[0%]">
                      Monday to Friday (12am — 9am)
                    </p>
                  </div>

                  
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side image */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[732px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[882px]">
              <Image
                src="/img/pricing.png"
                alt="The Social Chamber"
                fill
                className="object-cover rounded-[16px]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 732px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Reserve Now button */}
        <div className="flex justify-center mt-8 md:mt-[45px] lg:mt-[70px]">
          <Link href="/booking">
            <button className="inline-flex items-center justify-center bg-[#FF6900] hover:bg-[#ff5500] text-white text-base font-medium py-3 md:py-4 px-6 md:px-8 rounded-[8px] transition-colors">
              Reserve Now <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
