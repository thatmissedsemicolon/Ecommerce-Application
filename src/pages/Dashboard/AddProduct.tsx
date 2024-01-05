import React from 'react'
import { 
  FormFields, 
  initialValues 
} from '../../utils'

import { ReusableForm } from '../../components'
import { ProductType } from '../../utils/types'
import { addProduct } from '../../api'
import { showSuccess } from '../../utils'

const AddProduct: React.FC = () => {
  const handleFormSubmit = async (values: ProductType) => {
    const { data } = await addProduct(values)
    if (data) showSuccess('Product Added!')
  }

  return (
    <div className='flex flex-col justify-center items-center py-12'>
      <div className='bg-white shadow-md rounded p-8 mx-auto w-full md:w-1/2'>
        <ReusableForm
          text="Add Product"
          fields={FormFields}
          initialValues={initialValues}
          onSubmit={handleFormSubmit}
        />
      </div>
    </div>
  )
}

export default AddProduct
