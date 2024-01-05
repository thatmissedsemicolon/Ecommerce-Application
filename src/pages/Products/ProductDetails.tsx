import React, { 
  useState, 
  useEffect, 
  useContext 
} from 'react'

import { 
  CartContextType, 
  ProductDetailsProps, 
  ProductProps, 
  CartItem, 
  Reviews,
} from '../../utils/types'

import { 
  getProductById, 
  addReview,
  orderValidation,
  addToWishList,
  productInWishList,
  removeFromWishList
} from '../../api'

import { 
  AiFillStar, 
  AiOutlineStar 
} from 'react-icons/ai'

import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { FormField } from '../../components'
import Loader from '../../utils/Loader'
import Recommendation from './Recommendation'
import CartContext from '../../context/CartContext'

const ProductDetails: React.FC<ProductDetailsProps> = ({ user }) => {
  const [product, setProduct] = useState<ProductProps>()
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [newReview, setNewReview] = useState<Reviews>({ name: '', rating: 0, comment: '', userId: '' })
  const [nextPageAvailable, setNextPageAvailable] = useState<boolean>(false)
  const [hasUserPurchased, setHasUserPurchased] = useState<boolean>(false)
  const [isInWishList, setIsInWishList] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { cart, setCart } = useContext(CartContext) as CartContextType
  const { category, productId } = useParams<{ category: string, productId: string }>()

  const { name, rating, comment, userId } = newReview

  const [currentPage, setCurrentPage] = useState(1)

  const discountedPrice = product && (product.price * (100 - product?.discount_percentage)) / 100

  const ProductDetail = (label: string, value: string | number | undefined) => {
    if (value !== undefined) {
      return (
        <div className="mt-2">
          <span className="text-lg font-semibold">{label}:</span>
          <span className="text-lg ml-2">{value}</span>
        </div>
      )
    }
    return null
  }

  const addToCart = (product: ProductProps) => {
    const existingProductIndex = cart.findIndex((item: CartItem) => item._id === product._id)

    let newCart
  
    if (existingProductIndex !== -1) {
      newCart = cart.map((item, i) => {
        if (i === existingProductIndex) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item
      })
    } else {
      const newProduct = { _id: product._id, quantity: 1 }
      newCart = [...cart, newProduct]
    }

    setCart(newCart as CartItem[])
    localStorage.setItem("cart", JSON.stringify(newCart))
  }

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    setReviews([...reviews, newReview])
    await addReview({ productId: productId || '', name, rating, comment, userId })
    setNewReview({ name: '', rating: 0, comment: '', userId: '' })
  }

  const handleAddToWishlist = async () => {
    if (!userId|| !productId) return

    setIsInWishList(!isInWishList)

    await addToWishList({ _id: uuidv4(), productId, userId })
  }

  const handleRemoveFromWishlist = async () => {
    if (!userId|| !productId) return

    setIsInWishList(!isInWishList)

    await removeFromWishList({ productId, userId })
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return
  
      setLoading(true)
  
      const wishListPromise = userId ? productInWishList(productId) : Promise.resolve(null)
      const orderValidationPromise = userId ? orderValidation(productId) : Promise.resolve(null)
      const productDetailsPromise = getProductById(productId, currentPage)
  
      try {
        const [wishListResponse, orderValidationResponse, productDetailsResponse] = await Promise.all([
          wishListPromise,
          orderValidationPromise,
          productDetailsPromise
        ])
  
        if (wishListResponse?.data?.message) setIsInWishList(true)
  
        if (orderValidationResponse?.data) setHasUserPurchased(orderValidationResponse.data.message)
  
        if (productDetailsResponse?.data) {
          setProduct(productDetailsResponse.data)
          setReviews(productDetailsResponse.data.reviews)
          setNextPageAvailable(productDetailsResponse.data.next_page_available)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
  
    fetchData()
  }, [productId, userId, currentPage])
  
  useEffect(() => {
    if (user) {
      setNewReview(review => ({
        ...review,
        name: user?.name || '',
        userId: user?._id || ''
      }))
    }
  }, [user])  

  if (loading) return <Loader className='flex flex-col justify-center items-center h-screen' />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col">
        <div className='flex flex-wrap'>
          <div className="w-1/2">
            <img src={product?.thumbnail || 'default-placeholder-image.jpg'} alt={product?.title || 'Product Image'} className="w-full rounded-lg shadow-lg" />
          </div>
          <div className="w-1/2 px-8">
            <h1 className="text-3xl font-semibold mb-4">{product?.title}</h1>
            <p className="text-lg font-light mb-4">{product?.description}</p>
  
            <div className="mb-4">
              <span className="text-2xl font-semibold">${discountedPrice?.toFixed(2)}</span>
              <span className="text-lg text-gray-500 line-through ml-2">${product?.price}</span>
              <span className="text-lg text-green-500 ml-2">{product?.discount_percentage}%</span>
            </div>

            <div className='flex flex-row items-center'>
              <p className='text-lg font-semibold mr-2'>Rating:</p>
              {
                [...Array(5)].map((_, i) => {
                  const ratingValue = i + 1;
                  return (
                    <span key={i}>
                      {ratingValue <= Math.round(Number(product?.average_rating)) ? (
                        <AiFillStar className="text-yellow-500" />
                      ) : (
                        <AiOutlineStar className="text-gray-400" />
                      )}
                    </span>
                  );
                })
              }
            </div>

            <React.Fragment>
              {ProductDetail('Stock', `${product?.stock} available`)}
              {ProductDetail('Brand', product?.brand)}
              {ProductDetail('Category', product?.category)}
            </React.Fragment>
  
            <div className="flex space-x-4 mt-4">
              <button disabled={product && product?.stock <= 0} onClick={() => user ? (product && addToCart(product)) : (window.location.href = `/signin?redirect=products/${category}/${productId}`)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500">
                {product && product?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              {user && (
                <button
                  onClick={isInWishList ? handleRemoveFromWishlist : handleAddToWishlist}
                  className={`${
                    isInWishList ? 'bg-red-500 hover:bg-red-400' : 'bg-yellow-500 hover:bg-yellow-600'
                  } text-white px-4 py-2 rounded-md`}
                >
                  {isInWishList ? 'Remove from Wishlist' : 'Save to Wishlist'}
                </button>
              )}
            </div>
          </div>
        </div>
  
        {reviews.length > 0 && (
          <div className='flex flex-col justify-center items-center mt-8'>
            <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white p-4 mb-4 rounded-md shadow-md hover:bg-gray-100">
                  <h3 className="text-lg font-semibold">{review.name}</h3>
                  <div className='flex flex-row items-center'>
                    <p className='text-sm mr-2'>Rating:</p>
                    {[...Array(5)].map((_, i) => {
                      const ratingValue = i + 1;
                      return (
                        <span key={i}>
                          {ratingValue <= Math.round(Number(review.rating)) ? (
                            <AiFillStar className="text-yellow-500" />
                          ) : (
                            <AiOutlineStar className="text-gray-400" />
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
              
            <div className="flex justify-center items-center mt-4">
              <button 
                onClick={() => setCurrentPage(currentPage - 1)} 
                disabled={currentPage === 1}
                className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(currentPage + 1)} 
                disabled={!nextPageAvailable}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {user && hasUserPurchased && (
          <div className="w-full mt-8">
            <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <FormField
                type="number"
                id="rating"
                label="Rating"
                min={1}
                max={5}
                value={newReview?.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                required
              />
              <FormField
                type="textarea"
                id="text"
                label="Review"
                value={newReview?.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              />
              <button type={user ? "submit" : "reset"} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md">
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
  
      <Recommendation 
        category={category || ''} 
        productId={productId || ''} 
        addToCart={(product) => addToCart(product)} 
      />
    </div>
  )  
}

export default ProductDetails