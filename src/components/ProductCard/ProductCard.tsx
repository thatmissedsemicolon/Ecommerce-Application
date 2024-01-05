import React from 'react'
import { ProductCardProps } from '../../utils/types'

const ProductCard: React.FC<ProductCardProps> = ({ product, category, addToCart }) => {
  const discountedPrice = product && (product?.price * (100 - product?.discount_percentage)) / 100

  return (
    <div className="border rounded p-4 bg-white shadow-md">
      <a href={`/products/${category}/${product._id}`}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover mb-4"
        />
      </a>
      <h3 className="text-lg font-semibold mb-2 truncate w-full">{product.title}</h3>
      <div className="flex justify-between items-center">
        <span className="font-bold text-xl">${discountedPrice.toFixed(2)}</span>
        <button onClick={(e) => { e.stopPropagation(); addToCart(product) }} className="bg-blue-600 text-white py-1 px-4 rounded hover:bg-blue-500">
          Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard
