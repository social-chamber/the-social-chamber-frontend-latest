"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";

export default function Faq() {
  const {
    data: faqData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["faq-space"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/admin/cms/faqs`,
        {
          method: "GET",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch FAQs");
      }

      return res.json();
    },
  });

  const faqAllData = faqData?.data || [];

  return (
    <div className="w-full container mx-auto py-[40px] md:py-[70px] lg:py-[100px]">
      <h2 className="font-poppins text-xl md:text-2xl lg:text-[32px] font-semibold leading-[120%] tracking-[0%] mb-4 md:mb-5 lg:mb-6">
        Frequently Asked Questions
      </h2>

      {isLoading ? (
        <p className="font-poppins text-center text-base">Loading FAQs...</p>
      ) : isError ? (
        <p className="font-poppins text-center text-red-500 text-base">
          Failed to load FAQs. Please try again later.
        </p>
      ) : (
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-4 md:space-y-6 lg:space-y-8"
        >
          {faqAllData.map((faq: any, index: number) => (
            <AccordionItem
              key={faq._id}
              value={`item-${index}`}
              className="border border-[#706F6F] rounded-[8px] px-4"
            >
              <AccordionTrigger className="py-4 md:py-5 text-[18px] font-poppins leading-[120%] tracking-[0%] text-left font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 pt-1 text-base font-normal leading-[120%] tracking-[0%] font-poppins">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
