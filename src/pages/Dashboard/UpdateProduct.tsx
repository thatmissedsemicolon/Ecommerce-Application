import React, { 
  useState, 
  useEffect 
} from 'react'

import {
  getProductById, 
  updateProduct 
} from '../../api'

import { 
  ProductFormProps, 
  ProductType 
} from '../../utils/types'

import { 
  FormFields, 
  showSuccess 
} from '../../utils'

import { useParams } from 'react-router-dom'
import { ReusableForm } from '../../components'
import Loader from '../../utils/Loader'

const UpdateProduct: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [formInitialValues, setFormInitialValues] = useState<ProductFormProps>({
    _id: '',
    title: '',
    description: '',
    price: 0,
    discount_percentage: 0,
    stock: 0,
    brand: '',
    category: '',
    thumbnail: '',
    reviews: [],
  })

  const { productId } = useParams<{productId: string}>()

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const { data } = await getProductById(productId ?? '', 1)
        if (data) setFormInitialValues(data)
      }
      catch (e) {
        console.log(e)
      }
      finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleFormSubmit = async (values: ProductType) => {
    const { data } = await updateProduct(values)
    if (data) showSuccess('Changes Saved!')
  }

  if (loading) <Loader className='flex flex-col justify-center items-center h-screen' />

  return (
    <div className='flex flex-col justify-center items-center py-12'>
      <div className='bg-white shadow-md rounded p-8 mx-auto w-full md:w-1/2'>
        <ReusableForm
          text="Edit Product"
          fields={FormFields}
          initialValues={formInitialValues}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  )
}

export default UpdateProduct
