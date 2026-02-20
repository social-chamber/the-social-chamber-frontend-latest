"use client";

import "@/app/globals.css";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import { updatesAllData } from "@/components/data/updates-all-data";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const breakpoints = {
  0: {
    slidesPerView: 1,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  1024: {
    slidesPerView: 3,
    spaceBetween: 30,
  },
  1440: {
    slidesPerView: 4,
    spaceBetween: 30,
  },
};

const UpdatesSlider = () => {
  const { data} = useQuery({
    queryKey: ["allblog"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/blogs`
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return res.json();
    },
  });

  return (
    <div className="container mx-auto pb-[40px] md:pb-[70px] lg:pb-[100px]">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={breakpoints}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="rounded-lg"
      >
        {data?.data?.map((update: any) => (
          <SwiperSlide key={update._id} className="w-full pb-16">
            <Image
              src={update.thumbnail}
              alt={update.title || "Update Image"}
              width={354}
              height={300}
              className="w-full h-[300px] object-cover rounded-t-[8px]"
            />
            <div className="pt-[16px] md:pt-[21px] lg:pt-[26px]">
              <h4 className="font-poppins text-base font-semibold text-[#2A2A2A] leading-[120%]">
                {update.title}
              </h4>
              <p className="font-poppins text-base font-medium text-[#5A5A5A] leading-[120%] pt-2">
                {update.desc}
              </p>
              <div className="pt-3 md:pt-4">
                <Link href={`/updates/${update._id}`} passHref>
                  <button
                    className="font-poppins w-full flex items-center justify-between text-lg font-medium text-[#FF6900]"
                    aria-label={`Read more about ${update.title}`}
                  >
                    Explore Blog <ArrowRight />
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default UpdatesSlider;
