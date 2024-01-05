import { 
  ErrorResponse, 
  ProductFormField, 
  ProductFormProps 
} from "./types"

import { v4 as uuidv4 } from 'uuid'
import { AxiosError } from "axios"
import { toast } from 'react-toastify'

export const NavLinks = [ 
  {
    name: 'Electronics',
    href: 'electronics',
  },
  {
    name: 'Beauty',
    href: 'beauty',
  },
  {
    name: 'Men',
    href: 'men',
  },
  {
    name: 'Women',
    href: 'women',
  },
  {
    name: 'Home',
    href: 'home',
  },
  {
    name: 'Furnitures',
    href: 'furnitures',
  },
  {
    name: 'Sports',
    href: 'sports',
  },
  {
    name: 'Books',
    href: 'books',
  },
  {
    name: 'More',
    href: 'more',
  },
]

export const FormFields: ProductFormField[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    placeholder: 'Enter title',
    className: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter description',
    className: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    options: ['', 'electronics', 'beauty', 'men', 'women', 'home', 'furnitures', 'sports', 'books', 'more'],
    className: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    placeholder: 'Product Price',
    className: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
  },
  {
    name: 'discount_percentage',
    label: 'Discount Percentage',
    type: 'number',
    placeholder: 'Discount Percentage',
    className: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
  },
  {
    name: 'stock',
    label: 'Stock',
    type: 'number',
    placeholder: 'Available on Stock',
    className: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
  },
  {
    name: 'brand',
    label: 'Brand',
    type: 'text',
    placeholder: 'Brand Name',
    className: 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
  },
  {
    name: 'thumbnail',
    label: 'Product Image',
    type: 'file',
    className: 'block w-full text-sm text-blue-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none',
  },
]

export const showSuccess = (successMsg: string) => {
  toast.success(successMsg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export const showError = (errorMsg: string) => {
  toast.error(errorMsg, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  })
}

export const withErrorHandler = <T extends unknown[], R>(fn: (...args: T) => Promise<R>) => {
  return async (...args: T): Promise<R | void> => {
    try {
      return await fn(...args)
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>
      const errorMsg = axiosError.response?.data?.message || "An error occurred"

      const statusCode = axiosError.response?.status;
      if (statusCode === 401 || statusCode === 403 || statusCode === 500) {
        showError(errorMsg)
        localStorage.clear()
        window.location.href = '/'
      }
    }
  }
}

export const initialValues: ProductFormProps = {
  _id: uuidv4(),
  title: '',
  description: '',
  price: 0,
  discount_percentage: 0,
  stock: 0,
  brand: '',
  category: '',
  thumbnail: '',
  reviews: [],
}

export const formatPrice = (price: number, discountPercentage: number, showOriginal: boolean = false): string => {
  const originalPrice = price
  const discountedPrice = ((price || 0) * (100 - (discountPercentage || 0))) / 100

  let formattedPrice = discountedPrice.toFixed(2)

  if (discountedPrice < 0) {
    formattedPrice = `-$${Math.abs(Number(formattedPrice))}`
  } else {
    formattedPrice = `$${formattedPrice}`
  }

  return showOriginal ? `${formattedPrice} (Original: $${originalPrice})` : formattedPrice
}

export const formatDate = (dateString: string) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const year = dateString.substring(0, 4)
  const monthIndex = parseInt(dateString.substring(5, 7), 10) - 1
  const monthName = monthNames[monthIndex]
  return `${monthName} ${year}`
}
