import React, { 
  useState, 
  useEffect, 
  useContext 
} from 'react'

import { 
  addOrder, 
  getProductById 
} from '../../api'

import { 
  CartContextType, 
  CartProps, 
  CartItemsComponentProps, 
  CartItemComponentProps, 
  TotalComponentProps, 
  ProductProps 
} from '../../utils/types'

import { v4 as uuidv4 } from 'uuid'
import Loader from '../../utils/Loader'
import cartImage from '../../assets/empty-cart.svg'
import CartContext from '../../context/CartContext'

const Cart: React.FC<CartProps> = ({ user }) => {
  const [products, setProducts] = useState<ProductProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const { cart, setCart } = useContext(CartContext) as CartContextType

  const userLocalTime = new Date()

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item._id !== productId)
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const getTotal = () => {
    return products.reduce((total, item) => {
      const discountedPrice = item.price * (100 - item.discount_percentage) / 100
    return total + discountedPrice * (item.quantity ?? 0)
    }, 0).toFixed(2)
  }

  const purchase = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setLoading(true)
    
    const order = {
      _id: uuidv4(),
      userId: user?._id ?? '',
      email: user?.email ?? '',
      items: cart,
      status: 'Confirmed',
      total: Number(getTotal()),
      date: String(userLocalTime)
    }

    const { data } = await addOrder(order)

    if (data) {
      setLoading(false)
      window.location.href = `/orders/${data._id}`
      localStorage.removeItem('cart')
    }
  }

  const increaseQuantity = (productId: string) => {
    const updatedCart = cart.map(item => {
      if (item._id === productId) {
        return { ...item, quantity: item.quantity + 1 }
      }
      return item
    })
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  };
  
  const decreaseQuantity = (productId: string) => {
    const targetItem = cart.find(item => item._id === productId)
    if (targetItem && targetItem.quantity === 1) {
      removeFromCart(productId)
    } else {
      const updatedCart = cart.map(item => {
        if (item._id === productId) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item
      });
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    }
  }  

  useEffect(() => {
    document.title = cart.length !== 0 ? `Cart(${cart.length})` : 'Cart'

    const fetchProducts = async () => {
      setLoading(true)
      const fetchedProducts = await Promise.all(
        cart.map(async (item) => {
          const { data } = await getProductById(item._id, 1)
          return { ...data, quantity: item.quantity }
        })
      )
      setProducts(fetchedProducts)
      setLoading(false)
    }

    fetchProducts()
  }, [cart])

  if (loading) return <Loader className='flex flex-col justify-center items-center h-screen' />

  return (
    <section className='bg-gray-100'>
      <div className='max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 md:mt-0 pt-8 pb-12 md:pt-24'>
        {cart.length === 0 ? (
          <EmptyCartComponent />
        ) : (
          <CartItemsComponent 
            products={products} 
            removeFromCart={removeFromCart} 
            getTotal={getTotal} 
            purchase={purchase} 
            increaseQuantity={increaseQuantity} 
            decreaseQuantity={decreaseQuantity}
          />
        )}
      </div>
    </section>
  )
}

const EmptyCartComponent = () => (
  <div className='flex flex-wrap bg-white p-4 items-center justify-center gap-20'>
    <div className='flex flex-col'>
      <img src={cartImage} alt="empty-cart" className='w-[600px]' />
    </div>
    <div className='flex flex-col justify-center items-center'>
      <p className='text-center text-xl font-semibold'>Your Cart is empty.</p>
        <p className='mt-4 px-8 font-sans'>Your Shopping Cart lives to serve. Give it purpose — fill it with groceries, clothing, household supplies, electronics, and more.
        Continue shopping on the <a href='/' className='text-blue-500 font-semibold hover:underline'>E-shop</a> homepage.</p>
    </div>
  </div>
)

const CartItemsComponent: React.FC<CartItemsComponentProps> = ({ products, removeFromCart, getTotal, purchase, increaseQuantity, decreaseQuantity }) => (
  <div className="space-y-4">
    {products?.map((item) => (
      <CartItemComponent
        key={item._id} 
        item={item}
        removeFromCart={removeFromCart} 
        increaseQuantity={increaseQuantity} 
        decreaseQuantity={decreaseQuantity} 
      />
    ))}
    <TotalComponent total={getTotal()} purchase={purchase} />
  </div>
)

const CartItemComponent: React.FC<CartItemComponentProps> = ({ item, removeFromCart, increaseQuantity, decreaseQuantity }) => (
  <div className="grid grid-cols-5 gap-4 items-center bg-white shadow rounded p-4">
    <img className="w-full h-32 object-cover rounded" src={item.thumbnail} alt={item.title} />
    <div className="col-span-3">
      <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
    </div>
    <div className="text-right">
      <p className="text-xl font-semibold mb-2">
        ${((item.price * (100 - item.discount_percentage)) / 100).toFixed(2)}
      </p>
      <div className="flex items-end justify-end mt-4">
        <button onClick={() => decreaseQuantity(item._id || '')} className="bg-gray-300 text-black px-2 rounded">-</button>
        <p className="text-gray-600 mx-2">Qty: {item.quantity}</p>
        <button onClick={() => increaseQuantity(item._id || '')} className="bg-gray-300 text-black px-2 rounded">+</button>
      </div>
      <button className="bg-red-600 text-white font-semibold py-1 px-2 rounded hover:bg-red-700 mt-4"
        onClick={() => removeFromCart(item._id || '')}>
        Remove
      </button>
    </div>
  </div>
)

const TotalComponent: React.FC<TotalComponentProps> = ({ total, purchase }) => (
  <div className="flex items-end justify-end mt-6">
    <div className="w-64 p-4 bg-white shadow rounded">
      <p className="text-xl font-semibold mb-4">Total: ${total}</p>
      <button onClick={purchase} className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700">
        Place order
      </button>
    </div>
  </div>
)

export default Cart
