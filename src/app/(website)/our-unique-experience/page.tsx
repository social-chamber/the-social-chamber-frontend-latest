// import Faq from '@/components/Faq'
import HeroSection from '@/components/Hero'
import { Experience } from '@/components/hero-title'
// import ReviewCarousel from '@/components/Review'
import RoomGallery from '@/components/RoomGallery'
import SocialChamber from '@/components/SocialChamber'
import React from 'react'
import HowItWorks from './_components/HowItWork'

const page = () => {
  return (
    <div>
      <HeroSection heading={<Experience />}/>
      <SocialChamber/>
      <HowItWorks/>
      <RoomGallery/>
      {/* <Faq/> */}
      {/* <ReviewCarousel/> */}
    </div>
  )
}

export default page
