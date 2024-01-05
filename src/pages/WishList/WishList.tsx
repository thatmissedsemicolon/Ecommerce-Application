import React, { 
  useState, 
  useEffect 
} from 'react'

import { 
  getWishList, 
  getProductById 
} from '../../api'

import { 
  WishListProps, 
  ProductProps 
} from '../../utils/types'

import { 
  AiFillStar, 
  AiOutlineStar 
} from 'react-icons/ai'

import Loader from '../../utils/Loader'

const WishList: React.FC<WishListProps> = ({ user }) => {
  const [wishListItems, setWishListItems] = useState<ProductProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  document.title = `${user?.name}'s Wishlist`

  useEffect(() => {
    const fetchWishListItems = async () => {
      setLoading(true)
      try {
        const { data } = await getWishList()
        if (data.response) {
          const productDetails: ProductProps[] = await Promise.all(
            data.wishlist.products.map((id: string) => 
              getProductById(id, 1).then(res => res.data as ProductProps)
            )
          )

          setWishListItems(currentItems => [...currentItems, ...productDetails])
        }
      } catch {
        console.log('Wishlist Empty')
      }
      finally {
        setLoading(false)
      }
    }

    fetchWishListItems()
  }, [])

  if(loading) return <Loader className='flex flex-col justify-center items-center h-screen' />

  if (wishListItems?.length === 0) {
    return (
      <section className='bg-gray-100'>
        <div className='bg-white flex flex-col justify-center items-center h-screen'>
          <p>Your wishlist is empty...</p>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-gray-100'>
      <div className='bg-white max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 pt-8 pb-12'>
        <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
        <div className='grid md:grid-cols-3 xl:grid-cols-5 gap-5'>
          {wishListItems?.map((items: ProductProps) => (
            <a key={items._id} href ={`/products/${items.category}/${items?._id}`}>
              <div className='bg-white p-5 flex flex-col justify-center items-center'>
                <div className="w-[200px] h-[300px] mx-auto bg-gray-100 p-2">
                  <img 
                    src={items.thumbnail} 
                    alt='thumbnail'
                    className='w-full h-full object-contain' 
                  />
                </div>
                <h3 className='text-center font-serif mt-2 hover:text-gray-500'>{items?.title}</h3>
                <div className='flex items-center space-x-2 justify-center mt-4'>
                  <div className="flex items-center justify-center mt-4 space-x-2">
                    {
                      [...Array(5)].map((_, i) => {
                        const ratingValue = i + 1
                        return (
                          <span key={i}>
                            {ratingValue <= Number(items.average_rating) ? (
                              <AiFillStar className="text-yellow-500" />
                            ) : (
                              <AiOutlineStar className="text-gray-400" />
                            )}
                          </span>
                        );
                      })
                    }
                    <span>({items.reviews.length})</span>
                  </div>
                </div>
                <div className="flex items-center justify-center mt-4">
                  <span className="font-bold flex items-center">
                  ${(((items.price || 0) * (100 - (items.discount_percentage || 0))) / 100).toFixed(2)}
                    <p className="text-sm text-gray-500 pl-3 line-through">
                      {items.price}
                    </p>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WishList