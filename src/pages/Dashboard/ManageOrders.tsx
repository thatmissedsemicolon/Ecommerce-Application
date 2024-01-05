import React, { 
  useState, 
  useEffect 
} from 'react'

import {
  OrderProps, 
  ManageOrderProps 
} from '../../utils/types'

import io from 'socket.io-client'

import { URI } from '../../api'
import { Pagination } from '../../components'
import Loader from '../../utils/Loader'

const socket = io(URI)

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderProps[] | null>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState<boolean>(false)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    socket.emit('getOrders', { page })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

  useEffect(() => {
    setLoading(true)

    const handleOrders = (data: ManageOrderProps) => {
      setOrders(data.orders)
      setTotalPages(data.total_pages)
    }

    socket.on('orders', handleOrders)

    socket.emit('get_orders', { searchTerm: searchTerm, page: currentPage })

    setLoading(false)

    return () =>{
      socket.off('orders', handleOrders)
    }
  }, [searchTerm, currentPage])

  if(loading) return <Loader className='flex flex-col justify-center items-center h-screen' />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex flex-row justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-6">Manage Orders</h1>
        <input
          type="text"
          placeholder="Search orders..."
          className="w-64 rounded-md py-2 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                View Order
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map(order => (
              <tr key={order._id}>
                <td className="px-6 py-4">{order._id}</td>
                <td className="px-6 py-4">{order.email}</td>
                <td className="px-6 py-4">{order.items.map((item) => item.quantity)}</td>
                <td className="px-6 py-4">{order.status}</td>
                <td onClick={() => window.location.href = `/dashboard/manage-orders/edit/${order._id}`} className='cursor-pointer px-6 py-4 whitespace-nowrap rounded-md text-green-600 font-bold'>View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default ManageOrders
