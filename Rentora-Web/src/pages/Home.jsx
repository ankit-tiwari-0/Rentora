import React from 'react'
import Hero from '../component/Hero'
import FeaturedVehicles from '../component/Feature'
import BecomeOwner from './BecomeOwner'

const Home = () => {
  return (
    <div>
        <Hero />
        <FeaturedVehicles />
        <BecomeOwner />
    </div>
  )
}

export default Home