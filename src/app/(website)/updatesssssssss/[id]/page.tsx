"use client";
import Image from "next/image";
import UpdatesSlider from "../_components/UpdatesSlider";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

const Page = () => {
  const pathname = usePathname();
  const id = pathname.replace("/updates/", "");
  const { data } = useQuery({
    queryKey: ["blog"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/blogs/${id}`
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return res.json();
    },
  });

  return (
    <div className="container mx-auto">
      <div className="pt-[100x] md:pt-[130px] lg:pt-[170px] pb-[40px] md:pb-[70px] lg:pb-[100px]">
        {data?.data?.thumbnail && (
          <Image
            src={data?.data?.thumbnail || ""}
            alt="Update Banner"
            width={1236}
            height={573}
            className="w-full h-[573px] object-cover rounded-[8px]"
          />
        )}
        <div className="pt-5 md:pt-[26px] lg:pt-8">
          <h5 className="font-manrope flex items-center gap-3 md:gap-4 text-base font-medium leading-[120%] tracking-[0%] text-[#FCB900]">
            {" "}
            <span className="w-[38.12px] h-[2px] bg-[#FF6900]" />{" "}
            {data?.data?.createdAt
              ? new Date(data?.data?.createdAt).toLocaleString()
              : ""}
            <span className="w-[38.12px] h-[2px] bg-[#FF6900]" />
          </h5>
          <h4 className="font-manrope text-xl md:text-[22px] lg:text-2xl font-bold leading-[120%] tracking-[0%] text-[#FF6900] pt-2 md:pt-3 lg:pt-4">
            {data?.data?.title}
          </h4>

          <p
            dangerouslySetInnerHTML={{ __html: data?.data?.description || "" }}
            className="prose font-manrope text-base font-normal leading-[150%] tracking-[0%] text-black pt-[24px] md:pt-[32px] lg:pt-[43px]"
          ></p>
        </div>
      </div>
      {/* update slider  */}
      <UpdatesSlider />
    </div>
  );
};

export default Page;
