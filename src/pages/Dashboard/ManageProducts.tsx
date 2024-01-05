import React, { 
  useState, 
  useEffect 
} from 'react'

import { getProducts, deleteProduct } from '../../api'
import { useNavigate } from 'react-router-dom'
import { Pagination } from '../../components'
import { ProductProps } from '../../utils/types'
import Loader from '../../utils/Loader'

const ManageProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductProps[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const navigate = useNavigate() 

  const handlePageChange = (page: number) => setCurrentPage(page)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete the product?')) {
      const { data } = await deleteProduct(productId)
      if (data) window.location.reload()
    }
  }
  
  useEffect(() => {
    const fetchProducts = async (query: string, page: number) => {
      setLoading(true)
      const { data } = await getProducts(query, page)
      setProducts(data.products)
      setTotalPages(data.total_pages)
      setLoading(false)
    }
    
    if (searchTerm.length> 4) fetchProducts(searchTerm, currentPage)
    else fetchProducts(searchTerm, currentPage)
  },[searchTerm, currentPage])

  if(loading) return <Loader className='flex flex-col justify-center items-center h-screen' />

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex flex-row justify-between items-center'>
        <h1 className="text-2xl font-semibold mb-6">All Products</h1>
        <input
          type="text"
          placeholder="Search products..."
          className="w-64 rounded-md py-2 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thumbnail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Edit Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delete Product
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product: ProductProps) => (
              <tr key={product._id}> 
                <td className='px-6 py-4'><a href={'/products' + `/${product.category}` + `/${product._id}`}><img src={product.thumbnail} alt={product.title} className='w-12 h-12'/></a></td>
                <td className="px-6 py-4">{product.title}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.brand}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td onClick={() => navigate(`/dashboard/manage-products/edit/${product._id}`)} className='cursor-pointer px-6 py-4 whitespace-nowrap rounded-md text-red-600 font-bold'>Edit</td>
                <td onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product._id) }} className='cursor-pointer px-6 py-4 whitespace-nowrap rounded-md text-red-600 font-bold'>Delete</td>
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

export default ManageProducts