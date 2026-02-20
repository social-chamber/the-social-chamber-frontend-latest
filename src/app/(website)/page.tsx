import AsSeen from "@/components/AsSeen";
import HeroSection from "@/components/Hero";
import PrivateRoomH1 from "@/components/hero-title";
import HowItWorks from "@/components/HowItWork";
import PrivateRoomPromo from "@/components/PrivateRoom";
// import ReviewCarousel from "@/components/Review";
// import ShowRoom from "@/components/ShowRoom";
// import SocialSide from "@/components/SocialSide";
// import Updates from "@/components/ui/Updates";

export default function Home() {
  // const data = 10
  return (
    <div>
      <HeroSection heading={<PrivateRoomH1 />} />
      {/* <ShowRoom /> */}
      <HowItWorks />
      <PrivateRoomPromo />
      {/* <SocialSide /> */}
      {/* <Updates data={data} /> */}
      <AsSeen />
      {/* <ReviewCarousel />  */}
  
    </div>
  );
}
