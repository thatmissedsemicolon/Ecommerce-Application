import React from 'react'
import BannerImg from '../../assets/banner.jpg'

const Banner: React.FC = () => {
  return (
    <section className='bg-gray-100'>
      <div className='max-w-7xl mx-auto justify-center items-center'>
        <img src={BannerImg} alt="banner" className='w-full object-cover'/>
      </div>
    </section>
  )
}

export default Banner