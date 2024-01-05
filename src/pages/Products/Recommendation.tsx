import React, { 
  useState, 
  useEffect 
} from 'react'

import { 
  ProductProps,  
  RecommendationProps 
} from '../../utils/types'

import { getProductsByCategory } from '../../api'
import { ProductCard } from '../../components'

const Recommendation: React.FC<RecommendationProps> = ({ category, productId, addToCart }) => {
  const [products, setProducts] = useState<ProductProps[]>([])

  useEffect(() => {
    const fetchAllShoppingItems = async () => {
      const { data } = await getProductsByCategory(category, 1)
      if (data) {
        const filteredProducts = data.data.filter((product: ProductProps) => product._id !== productId)
        setProducts(filteredProducts)
      }
    };
    fetchAllShoppingItems()
  }, [category, productId])

  return (
    <div className="py-10">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Recommended Products</h1>
        {products.length === 0 && <p className='text-center'>No recommendation found..</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} category={category} product={product} addToCart={() => addToCart(product)} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Recommendation
