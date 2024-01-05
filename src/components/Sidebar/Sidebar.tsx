import React from 'react';
import { NavLink } from 'react-router-dom'
import { 
  AiFillHome, 
  AiOutlineShoppingCart, 
  AiFillShopping 
} from 'react-icons/ai'
import { FaUser } from "react-icons/fa"
import { UserContextType } from '../../utils/types'

interface LinkItem {
  name: string
  link: string
  icon?: JSX.Element
}

const Sidebar: React.FC<UserContextType> = ({ user }) => {
  const linkSections = [
    {
      title: "Dashboard",
      icon: <AiFillHome size={24} className="mt-0.5" />,
      links: [
        { name: "Dashboard", link: "dashboard" },
      ],
    },
    {
      title: "Users",
      icon: <FaUser size={22} className="mt-0.5" />,
      links: [
        { name: "Manage Users", link: "dashboard/manage-users" },
      ],
    },
    {
      title: "Products",
      icon: <AiOutlineShoppingCart size={24} className="mt-0.5" />,
      links: [
        { name: "Add Product", link: "dashboard/add-product" },
        { name: "Manage Products", link: "dashboard/manage-products" },
      ],
    },
    {
      title: "Orders",
      icon: <AiFillShopping size={24} className="mt-0.5" />,
      links: [
        { name: "Manage Orders", link: "dashboard/manage-orders" },
      ],
    },
  ]

  const renderLinkSection = (section: { title: string; icon: JSX.Element; links: LinkItem[] }, i: number) => (
    <div key={i} className='flex flex-col justify-center items-center mt-4 gap-2'>
      <div className='flex flex-row justify-start items-start text-gray-100 gap-2'>
        {section.icon}
        <h1 className='text-[22px]'>{section.title}</h1>
      </div>
      {section.links.map((link, i) => (
        <NavLink 
          key={i}
          to={`/${link.link}`}
          className={({ isActive }) => isActive ? 'bg-gray-800 min-w-[250px] px-4 py-2 text-center' : 'min-w-[250px] px-4 py-2 text-center'}
        >
          <p className='text-gray-100 text-sm'>{link.name}</p>
        </NavLink>
      ))}
    </div>
  )

  return (
    <nav className='bg-gray-900 border-r overflow-y-auto flex flex-col justify-between pb-10'>
      <div className='flex flex-col justify-center items-center'>
        <a href="/dashboard" className='flex flex-col justify-center items-center mt-4 gap-2'>
          <img src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user?.name}`} alt='profile-pic' className='w-[100px] h-[100px] rounded-full' />
          <h1 className='text-gray-100 text-md'>{user?.name}</h1>
        </a>
        <div>
          {linkSections.map((section, i) => renderLinkSection(section, i))}
        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
        <a href='/' className='bg-white px-2 py-1.5 rounded-md font-medium'>
          Back to Home
        </a>
      </div>
    </nav>
  )
}

export default Sidebar
