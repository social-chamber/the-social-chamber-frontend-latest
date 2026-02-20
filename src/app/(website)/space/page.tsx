// import Faq from "@/components/Faq";
import HeroSection from "@/components/Hero";
import { PrivateEscapeH1 } from "@/components/hero-title";
import HowItWorks from "@/components/HowItWork";
import MovieRoomSection from "@/components/MovieRoomSection";
import Pricing from "@/components/Pricing";
// import ReviewCarousel from "@/components/Review";
import SliderComponent from "@/components/slider-component";
import SocialChamberRoom from "@/components/SocialChamberRoom";
// import Updates from "@/components/ui/Updates";
import React from "react";

const page = () => {
  // const data = 10
  return (
    <div>
      <HeroSection heading={<PrivateEscapeH1 />} />
      <MovieRoomSection />
      <SliderComponent/>
      <HowItWorks />
      <Pricing />
      <SocialChamberRoom/>
      {/* <Faq /> */}
      {/* <Updates data={data} /> */}
      {/* <ReviewCarousel /> */}
    </div>
  );
};

export default page;
