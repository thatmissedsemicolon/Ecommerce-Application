import React from 'react'
import AccountCard from '../../components/AccountCard/AccountCard'
import { GrShieldSecurity } from 'react-icons/gr'
import { 
  GoPackage, 
  GoSignOut 
} from 'react-icons/go'
import { BsListStars } from 'react-icons/bs'

const Account: React.FC = () => {
  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-transparent p-6">
        <h1 className="text-2xl font-regular mb-8">Account</h1>
        <div className="grid gap-4 grid-cols-2 grid-rows-3">
          <AccountCard 
            title="Login & Security" 
            body="Edit name, email, and password" 
            icon={<GrShieldSecurity size={50} />}
            route="/account/login-and-security"
          />
          <AccountCard 
            title="Track Orders" 
            body="Track and cancel orders" 
            icon={<GoPackage size={50} />}
            route={`/orders`}
          />
          <AccountCard 
            title="Wishlist" 
            body="View your wishlist" 
            icon={<BsListStars size={50} />}
            route={`/wishlist`}
          />
          <AccountCard 
            title="Sign Out" 
            body="Sign out of your account" 
            icon={<GoSignOut size={50} />}
            route="/signout"
          />
        </div>
      </div>
    </div>
  )
}

export default Account