import React, { useState } from 'react'
import { 
  Routes, 
  Route 
} from 'react-router-dom'

import { 
  Home,
  Cart,
  Account,
  Orders,
  WishList,
  Products,
  ProductDetails,
  LoginAndSecurity,
  OrderConfirmation,
  NotFound,
} from '../pages'

import { 
  Header,
  Navbar
} from '../components'

import { HomeRoutesProps } from '../utils/types'
import { ProtectedRoute } from '.'

const HomeRoutes: React.FC<HomeRoutesProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState<string | null>(null)

  return (
    <React.Fragment>
      <Header user={user} setSearchTerm={setSearchTerm} />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products/:category' element={<Products searchTerm="" />} />
        <Route path='/search' element={<Products searchTerm={searchTerm || ""} />} />
        <Route path='/products/:category/:productId' element={<ProductDetails user={user} />} />
        <Route path='/cart' element={<Cart user={user} />} />
        <Route path='wishlist' element={<ProtectedRoute user={user}><WishList user={user} /></ProtectedRoute>} />
        <Route path='/account' element={<ProtectedRoute user={user}><Account /></ProtectedRoute>} />
        <Route path='/account/login-and-security' element={<ProtectedRoute user={user}><LoginAndSecurity user={user} /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute user={user}><Orders /></ProtectedRoute>} />
        <Route path='/orders/:orderId' element={<ProtectedRoute user={user}><OrderConfirmation user={user} /></ProtectedRoute>} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </React.Fragment>
  );
}

export default HomeRoutes