import React, { 
  useState, 
  useEffect 
} from 'react'

import { getUserOrders } from '../../api'
import { OrderProps } from '../../utils/types'
import Loader from '../../utils/Loader'

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderProps[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [hasMorePages, setHasMorePages] = useState<boolean>(true)

  useEffect(() => {
    document.title = "Orders"

    const fetchUsersOrders = async () => {
      if (!hasMorePages) return

      if (page === 1) setLoading(true)
      else setLoadingMore(true)

      try {
        const { data } = await getUserOrders('', page)
        if (data) {
          setOrders(prevOrders => [...prevOrders, ...data.orders])
          setHasMorePages(data.next_page_available)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    fetchUsersOrders()
  }, [page, hasMorePages])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || !hasMorePages) return
      setPage(prevPage => prevPage + 1)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMorePages])

  if (loading) return <Loader className='flex flex-col justify-center items-center h-screen' />

  if (orders.length === 0) return <p className='flex flex-col justify-center items-center h-screen'>No orders found...</p>

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <ul className="divide-y divide-gray-200">
        {orders.map((order) => (
          <li key={order._id} className="bg-white py-6 px-4 shadow-sm rounded-md mt-4">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <div className="flex-grow">
                <p className="text-lg font-semibold">Order ID: {order._id}</p>
                <p>Total: ${order.total}</p>
                <p>Status: {order.status}</p>
                <p>Items: {order.items.length} item(s)</p>
              </div>
              <div className="flex-shrink-0 mt-4 md:mt-0">
                <a href={`/orders/${order._id}`} className="p-2 text-white font-semibold bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded transition duration-150 ease-in-out">
                  View Details
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {loadingMore && <Loader className="flex justify-center items-center" />}
    </div>
  )
}

export default Orders