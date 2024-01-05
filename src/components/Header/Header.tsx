import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { BiSearchAlt2 } from 'react-icons/bi'
import { RiAdminFill } from 'react-icons/ri'
import HomePageImg from '../../assets/homepage_logo.png'
import CartContext from '../../context/CartContext'

import { 
  HeaderProps, 
  CartContextType 
} from '../../utils/types'

const Header: React.FC<HeaderProps> = ({ user, setSearchTerm }) => {
  const { cart } = useContext(CartContext) as CartContextType
  const navigate = useNavigate()

  return (
    <section className='bg-gray-900'>
      <div className='max-w-7xl flex mx-auto p-2 items-center justify-between gap-10'>
        <a href='/' className='flex flex-col items-start justify-start'>
          <img src={HomePageImg} alt="company-logo" className='h-[60px] pointer-events-none'/>
        </a>

        <div className='bg-gray-50 shadow-2xl p-3 flex-1 rounded-sm hidden lg:flex items-center space-x-3'>
          <input
            type="text"
            placeholder="Search"
            onFocus={() => navigate('/search')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none w-full h-full"
          />
          <BiSearchAlt2 size={25} />
        </div>

        <div className='hidden lg:flex items-center space-x-6 text-white'>
          <a href={user ? '/account' : '/signin'} className="flex flex-col items-center">
            <div className='flex flex-col font-semibold text-sm'>
              {user ? `Hi, ${user?.name}` : "Hello, signin"}
            </div>
            <div className='flex flex-col font-bold'>
              Account
            </div>
          </a>
        </div>

        {user?.user_is_admin &&
          <div className='hidden lg:flex items-center space-x-6 text-white'>
            <a href='/dashboard' className="flex items-center font-bold">
              <RiAdminFill size={30} /> Dashboard
            </a>
          </div>
        }

        <div className="relative items-center space-x-6 text-white">
          <a href="/cart" className="relative flex items-center font-bold">
            <AiOutlineShoppingCart size={30} /> Cart
            <span className="absolute -top-2 right-9 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart?.length}
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default Header