import React from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { NavLinks } from '../../utils'

const Navbar: React.FC = () => {
  return (
    <section className='bg-gray-700 shadow-xl'>
      <div className='max-w-7xl hidden lg:flex p-3 mx-auto items-center justify-between'>
        {NavLinks.map((navlink, i) => (
          <a href={`/products/${navlink.href}`} key={i} className='flex flex-row text-white font-semibold'>
            {navlink.name} <RiArrowDropDownLine size={26} />
          </a>
        ))}
      </div>
    </section>
  )
}

export default Navbar