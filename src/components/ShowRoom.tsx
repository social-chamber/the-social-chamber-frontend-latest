"use client";
import { useQuery } from "@tanstack/react-query";
import SmartImage from "@/components/ui/smart-image";

export default function ShowRoom() {
  const { data } = useQuery({
    queryKey: ["sub-hero"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/assets?type=image&section=sub-hero`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      return res.json();
    },
  });
  const contentImage = data?.data || [];
   // console.log(contentImage);

  return (
    <section className="w-full py-[60px] md:py-[100px] lg:py-[160px]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {contentImage?.map((data: any) => (
            <div key={data._id} className="rounded-[8px] overflow-hidden">
              <SmartImage
                src={data?.url}
                alt="People relaxing on a couch"
                width={354}
                height={270}
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
