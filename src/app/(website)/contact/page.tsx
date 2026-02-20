import ContactForm from '@/components/ContactForm'
import HeroSection from '@/components/Hero'
import { Contact } from '@/components/hero-title'
// import ReviewCarousel from '@/components/Review'
import React from 'react'

const page = () => {
  return (
    <div>
      <HeroSection heading={<Contact/>}/> 
      <ContactForm/>
      {/* <ReviewCarousel/> */}
    </div>
  )
}

export default page
