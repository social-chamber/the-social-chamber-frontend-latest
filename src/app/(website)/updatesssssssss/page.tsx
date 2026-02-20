import HeroSection from "@/components/Hero";
import { Stay } from "@/components/hero-title";
import React from "react";
import UpdatesComponent from "./_components/Updates";
// import ReviewCarousel from "@/components/Review";

const page = () => {
  return (
    <div>
      <HeroSection heading={<Stay />} />
      <UpdatesComponent/>
      {/* <ReviewCarousel/> */}
    </div>
  );
};

export default page;
