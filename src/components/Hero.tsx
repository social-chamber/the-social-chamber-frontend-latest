"use client";

// import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import SmartImage from "@/components/ui/smart-image";
import Link from "next/link";
import { ReactNode } from "react";
// import { usePathname } from "next/navigation";

interface Props {
  heading: ReactNode;
}

export default function HeroSection({ heading }: Props) {
  // const pathname = usePathname();

  // Map each pathname to a section value
  // const sectionMap: Record<string, string> = {
  //   "/": "hero",
  //   "/space": "space-hero",
  //   "/our-unique-experience": "experience-hero",
  //   "/updates": "updates-hero",
  //   "/contact": "contact-hero",
  // };

  // Fallback to 'banner' if pathname not matched
  // const section = sectionMap[pathname] || "banner";

  // const { data } = useQuery({
  //   queryKey: ["contentImage", section],
  //   queryFn: async () => {
  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/assets?type=image&section=${section}`
  //     );

  //     // Gracefully handle 404 by returning empty list so UI still renders
  //     if (res.status === 404) {
  //       return { data: [] } as { data: Array<{ url: string }> };
  //     }
  //     if (!res.ok) throw new Error("Network response was not ok");

  //     return res.json();
  //   },
  // });

  // const contentImage = data?.data[0];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-12 py-12 overflow-hidden pt-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {/* Prefer CMS hero; fallback to local if missing */}
        <SmartImage
          src={"/img/all/1750753400044-hero.jpeg"}
          alt="Themed room background"
          fill
          priority
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center pt-16">
        {heading}

        <Link
          href="/booking"
          className="inline-flex items-center justify-center bg-[#FF6900] hover:bg-[#ff5500] text-white text-base font-medium py-3 md:py-3 px-6 md:px-6 rounded-[8px] transition-colors"
        >
          Reserve Now <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
