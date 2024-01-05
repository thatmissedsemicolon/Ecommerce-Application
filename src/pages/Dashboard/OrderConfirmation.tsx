import React, { 
  useState, 
  useEffect 
} from 'react'

import { 
  useParams,
  useLocation
} from 'react-router-dom'

import { 
  URI,
  updateUserOrder, 
  cancelUserOrder
} from '../../api'

import { 
  OrderProps, 
  ProductProps, 
  CartItem, 
  OrderConfirmationProps 
} from '../../utils/types'

import { formatPrice } from '../../utils'
import io from 'socket.io-client'
import Loader from '../../utils/Loader'

const socket = io(URI)

const isProductType = (item: ProductProps | CartItem): item is ProductProps => (item as ProductProps).thumbnail !== undefined

const OrderManager: React.FC<OrderConfirmationProps> = ({ user }) => {
  const [order, setOrder] = useState<OrderProps | null>(null)
  const [orderStatus, setOrderStatus] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const { orderId } = useParams<{ orderId: string }>()

  const location = useLocation()

  const isManageOrderPage = () => location.pathname === `/dashboard/manage-orders/edit/${orderId}`

  const handleCancelOrder = async () => await cancelUserOrder(orderId ?? '')

  const handleUpdateOrder = async () => await updateUserOrder(orderStatus, orderId ?? '')

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'Confirmed': return 1
      case 'Processed': return 2
      case 'Fulfilled': return 3
      case 'Cancelled': return -1
      default: return 0
    }
  }

  const currentStep = order ? getStatusStep(order.status) : 0

  useEffect(() => {
    setLoading(true)

    const handleConnect = () => {
      console.log('Connected to server')
    }

    const handleOrderUpdate = (data: OrderProps) => {
      setOrder(data)
    }

    socket.emit('get_order_details', { userId: user?._id, orderId: orderId })

    socket.on('connect', handleConnect)
    socket.on('order_updated', handleOrderUpdate)
    socket.on('order_details', handleOrderUpdate)

    setLoading(false)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('order_updated', handleOrderUpdate)
      socket.off('order_details', handleOrderUpdate)
      socket.disconnect()
    };
  }, [user, orderId])

  if (loading) return <Loader className='flex flex-col justify-center items-center h-screen' />

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-1/3 ${currentStep === -1 ? 'bg-red-500' : currentStep >= 1 ? 'bg-green-500' : 'bg-gray-300'} h-2 rounded-full`}></div>
            <div className={`w-1/3 ${currentStep === -1 ? 'bg-red-500' : currentStep >= 2 ? 'bg-green-500' : 'bg-gray-300'} h-2 rounded-full mx-2`}></div>
            <div className={`w-1/3 ${currentStep === -1 ? 'bg-red-500' : currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'} h-2 rounded-full`}></div>
          </div>

          <div className="flex justify-between text-sm font-medium">
            <p className={`${currentStep >= 1 ? 'text-green-500' : 'text-gray-500'} ${currentStep === -1 ? 'line-through text-red-500' : ''}`}>Confirmed</p>
            <p className={`${currentStep >= 2 ? 'text-green-500' : 'text-gray-500'} ${currentStep === -1 ? 'line-through text-red-500' : ''}`}>Processed</p>
            <p className={`${currentStep >= 3 ? 'text-green-500' : 'text-gray-500'} ${currentStep === -1 ? 'text-red-500' : ''}`}>{currentStep === -1 ? 'Cancelled' : 'Fulfilled'}</p>
          </div>
        </div>

        <div className='mt-8'>
          <p>Order ID: {order?._id}</p>
          <p>Total: ${order?.total}</p>
        </div>

        <div className="mt-8 overflow-auto max-h-[400px]">
          {order?.items.map((item, i) => (
            <div key={i} className="bg-gray-100 rounded-md p-4 mb-4">
              <div className="flex items-center">
                {isProductType(item) && (
                  <React.Fragment>
                    <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover rounded-md mr-4" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p>Brand: {item.brand}</p>
                      <p>Price: {formatPrice(item.price, item.discount_percentage)}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isManageOrderPage() && (
          <div className="flex justify-between mt-4">
            <a
              href={`/orders`}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 rounded shadow transition duration-150 ease-in-out"
            >
              Back to Orders
            </a>

            {order?.status === "Confirmed" && (
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 text-sm text-white font-semibold bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 rounded shadow"
              >
                Cancel Order
              </button>
            )}
          </div>
        )}

        {order?.status !== 'Cancelled' && isManageOrderPage() && (
          <div className="flex justify-between items-center space-x-4">
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value=''></option>
              <option value="Processed">Processed</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              onClick={handleUpdateOrder}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
            >
              Update Status
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderManager
