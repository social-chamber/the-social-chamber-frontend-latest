// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Star } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
//   type CarouselApi,
// } from "@/components/ui/carousel";
// import Autoplay from "embla-carousel-autoplay";
// import { useQuery } from "@tanstack/react-query";

// type GoogleReviewResponse = {
//   status: boolean;
//   message: string;
//   data: GoogleReview[];
// };

// type GoogleReview = {
//   author_name: string;
//   author_url: string;
//   language: string;
//   original_language: string;
//   profile_photo_url: string;
//   rating: number;
//   relative_time_description: string;
//   text: string;
//   time: number;
//   translated: boolean;
// };

// export default function ReviewCarousel() {
//   const [api, setApi] = useState<CarouselApi>();
//   const [current, setCurrent] = useState(0);
//   useEffect(() => {
//     if (!api) return;

//     const onSelect = () => {
//       setCurrent(api.selectedScrollSnap());
//     };

//     api.on("select", onSelect);

//     return () => {
//       api.off("select", onSelect);
//     };
//   }, [api]);

//   const { data, isLoading, error, isError } = useQuery<GoogleReviewResponse>({
//     queryKey: ["review-all-data"],
//     queryFn: () =>
//       fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/review`).then(
//         (res) => res.json()
//       ),
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error: {error?.message}</p>;

//   return (
//     <div className="container mx-auto pt-[40px] md:pt-[70px] lg:pt-[104px] pb-[40px] md:pb-[60px] lg:pb-[80px]">
//       <div className="text-center pb-[40px] md:pb-[70px] lg:pb-[99px]">
//         <p className="font-poppins text-[#FCB900] text-lg font-semibold leading-[30px] tracking-[-0.22x] pb-[15px] md:pb-[20px] lg:pb-[25px]">
//           {/* 3940+ Happy Landingfolio Users */}
//         </p>
//         <h2 className="text-4xl md:text-5xl lg:text-[56px] text-[#FF6900] font-semibold font-poppins leading-[67px] tracking-[-2.16px]">
//           Don&apos;t just take our words
//         </h2>
//       </div>

//       <Carousel
//         setApi={setApi}
//         className="w-full"
//         opts={{
//           align: "start",
//           loop: true,
//         }}
//         plugins={[
//           Autoplay({
//             delay: 3000,
//           }),
//         ]}
//       >
//         <CarouselContent className="">
//           {data?.data?.map((testimonial, index) => (
//             <CarouselItem
//               key={index}
//               className="md:basis-1/2 lg:basis-1/2 px-0"
//             >
//               <Card className="border-none shadow-none">
//                 <CardContent className=" pr-0">
//                   <div className="flex flex-col md:flex-row gap-[15px] md:gap-[25px] lg:gap-[43px] ">
//                     <div className="relative overflow-hidden flex-shrink-0 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px]   rounded-full">
//                       <Image
//                         src={
//                           testimonial.profile_photo_url || "/placeholder.svg"
//                         }
//                         alt={testimonial.author_name}
//                         width={258}
//                         height={258}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex flex-col justify-center">
//                       <div className="flex gap-2 mb-2">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`h-5 w-5 ${
//                               i < testimonial.rating
//                                 ? "fill-orange-500 text-orange-500"
//                                 : "fill-gray-200 text-gray-200"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <p className="text-[17px] md:text-lg lg:text-xl font-medium font-poppins leading-[30px] tracking-[0%] text-[#090914]">
//                         &quot;{testimonial.text.slice(0, 100)}&quot;
//                       </p>
//                       <p className="text-base md:text-lg leading-[120%] tracking-[0%] text-[#595959] font-medium pt-4 md:pt-5 lg:pt-[25px]">
//                         {testimonial.author_name}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </CarouselItem>
//           ))}
//         </CarouselContent>
//         <div className="flex justify-center mt-8 md:mt-12 lg:mt-[80px]">
//           <CarouselPrevious className="static mr-2 translate-y-0" />
//           <div className="flex items-center justify-center gap-2">
//             {data?.data?.map((_, index) => (
//               <button
//                 key={index}
//                 className={`h-2 w-2 rounded-full transition-all ${
//                   current === index ? "w-4 bg-orange-500" : "bg-orange-200"
//                 }`}
//                 onClick={() => api?.scrollTo(index)}
//                 aria-label={`Go to slide ${index + 1}`}
//               />
//             ))}
//           </div>
//           <CarouselNext className="static ml-2 translate-y-0" />
//         </div>
//       </Carousel>
//     </div>
//   );
// }
