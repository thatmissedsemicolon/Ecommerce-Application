import React, { 
  useEffect, 
  useRef 
} from 'react'

import { 
  Routes, 
  Route 
} from 'react-router-dom'

import { UserContextType } from '../utils/types'

import { 
  AddProduct, 
  Dashboard,
  UpdateProduct,
  ManageProducts,
  ManageUsers,
  ManageOrders,
  OrderConfirmation,
  NotFound,
} from '../pages'

import Sidebar from '../components/Sidebar/Sidebar'

const DashboardRoutes: React.FC<UserContextType> = ({ user }) => {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [])

  return (
    <div className='flex md:flex-row flex-col h-[100%] transition-height duration-75 ease-out'>
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user={user} />
      </div>
      <div className='pb-2 flex-1 h-screen overflow-y-auto' ref={scrollRef}>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/manage-users' element={<ManageUsers />} />
          <Route path='/add-product' element={<AddProduct />} />
          <Route path='/manage-products' element={<ManageProducts />} />
          <Route path='/manage-products/edit/:productId' element={<UpdateProduct />} />
          <Route path='/manage-orders' element={<ManageOrders />} />
          <Route path='/manage-orders/edit/:orderId' element={<OrderConfirmation user={user} />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default DashboardRoutes
