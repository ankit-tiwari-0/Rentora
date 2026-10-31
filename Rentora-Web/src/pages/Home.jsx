import React from 'react'
import Hero from '../component/Hero'
import FeaturedVehicles from '../component/Feature'
import BecomeOwner from '../component/BecomeOwner'
import Testimonials from '../component/Testimonials'

const Home = () => {
  return (
    <div>
        <Hero />
        <FeaturedVehicles />
        <BecomeOwner />
        <Testimonials />
    </div>
  )
}

export default Home