import React from 'react'
import { AccountCardProps } from '../../utils/types';
import { signOut } from '../../api'

const AccountCard: React.FC<AccountCardProps> = ({ title, body, icon, route }) => {
  if (route === '/signout') {
    return (
      <button 
        onClick={signOut} 
        className="flex flex-row bg-transparent border border-gray-500 rounded-lg p-4 width-12 hover:bg-gray-200"
      >
        <div className="flex-[1_1_0%] justify-center items-center m-2"> 
          {icon} 
        </div>
        <div className="flex-[3_3_0%] flex-col text-left mt-2">
          <h1 className="text-md font-regular">{title}</h1>
          <p className="text-sm text-gray-500">{body}</p>
        </div>
      </button>
    )
  }

  return (
    <a 
      href={route} 
      className="flex flex-row bg-transparent border border-gray-500 rounded-lg p-4 width-12 hover:bg-gray-200"
    >
      <div className="flex-[1_1_0%] justify-center items-center m-2"> 
        {icon} 
      </div>
      <div className="flex-[3_3_0%] flex-col text-left mt-2">
        <h1 className="text-md font-regular">{title}</h1>
        <p className="text-sm text-gray-500">{body}</p>
      </div>
    </a>
  )
}

export default AccountCard