import React, { 
  useState, 
  useEffect 
} from 'react'

import { 
  ProductProps, 
  SearchTermProps 
} from '../../utils/types'

import { 
  AiFillStar, 
  AiOutlineStar 
} from 'react-icons/ai'

import { useParams } from 'react-router-dom'
import { getProductsByCategory } from '../../api'
import { formatPrice } from '../../utils'
import Loader from '../../utils/Loader'

const Products: React.FC<SearchTermProps> = ({ searchTerm }) => {
  const [allProducts, setAllProducts] = useState<ProductProps[]>([])
  const [filteredProducts, setFilteredProducts] = useState<ProductProps[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [hasMorePages, setHasMorePages] = useState<boolean>(true)
  const { category } = useParams<{ category?: string }>()

  useEffect(() => {
    document.title = category ? `${category.charAt(0).toUpperCase()}${category.slice(1)}` : "Products"
  }, [category])

  useEffect(() => {
    const fetchAllShoppingItems = async () => {
      if (!hasMorePages) return

      if (page === 1) setLoading(true)
      else setLoadingMore(true)

      try {
        const { data } = await getProductsByCategory(category || '', page)
        if (data) {
          setAllProducts(prevProducts => [...prevProducts, ...data.data])
          setFilteredProducts(prevFiltered => prevFiltered ? [...prevFiltered, ...data.data] : data)
        }
        setHasMorePages(data.nextPageAvailable)
      } catch (error) {
        console.error('Error fetching items:', error)
      }

      setLoading(false)
      setLoadingMore(false)
    }

    fetchAllShoppingItems()
  }, [category, page, hasMorePages])

  useEffect(() => {
    if (searchTerm) {
      const filteredItems = allProducts.filter((item) => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filteredItems)
    } else {
      setFilteredProducts(allProducts)
    }
  }, [searchTerm, allProducts])

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || !hasMorePages) return
      setPage(prevPage => prevPage + 1)
    };

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasMorePages])

  const productsToShow = filteredProducts || allProducts

  if (loading) return <Loader className='flex justify-center items-center h-screen'/>

  if (!productsToShow || productsToShow.length === 0) {
    return <div className='flex flex-col justify-center items-center h-screen'>No products found...</div>
  }

  return (
    <section className='bg-gray-100'>
      <div className='bg-white max-w-7xl mx-auto sm:px-6 lg:px-8 px-4 pt-8 pb-12'>
        {searchTerm && (
          <h2 className="text-2xl font-semibold mb-4">
            Showing results for: <span className="text-blue-500">{searchTerm}</span>
          </h2>
        )}
        <div className='grid md:grid-cols-3 xl:grid-cols-5 gap-5'>
          {productsToShow.map((product, i) => (
            <a key={i} href={`/products/${category || product.category}/${product._id}`} className="block p-5 hover:bg-gray-100 border border-gray-50 shadow-lg rounded-md">
              <div className='mx-auto w-full max-w-[600px]'>
                <div className="w-full h-[300px]">
                  <img 
                    src={product.thumbnail}
                    alt='product image' 
                    className='w-full h-full object-contain' 
                  />
                </div>
                <h3 className='mt-3 text-center text-lg font-serif hover:text-gray-500 truncate w-[200px]'>{product.title}</h3>
                <div className='flex items-center justify-center mt-4 space-x-2'>
                  {
                    [...Array(5)].map((_, i) => {
                      const ratingValue = i + 1
                      return (
                        <span key={i}>
                          {ratingValue <= Number(product.average_rating) ? (
                            <AiFillStar className="text-yellow-500" />
                          ) : (
                            <AiOutlineStar className="text-gray-400" />
                          )}
                        </span>
                      );
                    })
                  }
                  <span>({product.reviews.length})</span>
                </div>
                <div className='flex items-center justify-center mt-4'>
                  <span className="flex flex-wrap font-bold">
                    {formatPrice(product.price, product.discount_percentage)}
                    <p className="text-sm line-through text-gray-500 pl-3 mt-0.5">
                      {product.price}
                    </p>
                  </span>
                </div>
              </div>
            </a>          
          ))}
        </div>
        {loadingMore && <Loader className= "flex justify-center items-center" />}
      </div>
    </section>
  )
}

export default Products
