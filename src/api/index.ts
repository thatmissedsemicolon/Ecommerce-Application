import axios, { AxiosResponse } from "axios"
import { 
  SignInProps,
  SignUpProps, 
  ProductProps,
  AddReviewProps,
  OrderProps,
  WishListType,
  LoginandSecurity
} from "../utils/types"

// Server URI 
const URI = "http://localhost:8000"

const getLocalAccessToken = (): string | null => {
  return localStorage.getItem('access_token') !== 'undefined' ? localStorage.getItem('access_token') : null
}

export const getAccessToken = (): string | null => {
  return getLocalAccessToken()
}

export const token = getAccessToken()

// Headers
const headers = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

// API Calls

// Auth Operations
export const signUp = (props: SignUpProps): Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/signup', props)
export const signIn = (props: SignInProps): Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/signin', props)
export const getUser = (): Promise<AxiosResponse> => axios.get(`${URI}` + '/api/v1/user', { headers })
export const validateUserEmail = (email: string): Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/validate_email', { email })
export const updateUser = (props: LoginandSecurity): Promise<AxiosResponse> => axios.put(`${URI}` + '/api/v1/update_user', props, { headers })
export const deleteUser = (): Promise<AxiosResponse> => axios.delete(`${URI}` + '/api/v1/delete_user', { headers })
export const signOut = () => { localStorage.clear(); window.location.href = '/' }

// Products
export const getProductsByCategory = (category: string, page: number): Promise<AxiosResponse> => axios.get(`${URI}` + `/api/v1/products?category=${category}&page=${page}`)
export const getProductById = (productId: string, page: number): Promise<AxiosResponse> => axios.get(`${URI}` + `/api/v1/products?productId=${productId}&page=${page}`)
export const addReview = (props: AddReviewProps): Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/products/add_review', props, { headers })

// Orders
export const addOrder = (props: OrderProps): Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/add_order', props, { headers })
export const getUserOrders = (orderId?: string, page?: number): Promise<AxiosResponse> => axios.get(`${URI}` + `/api/v1/get_orders?orderId=${orderId}&page=${page}`, { headers })
export const cancelUserOrder = (orderId: string): Promise<AxiosResponse> => axios.put(`${URI}/api/v1/cancel_order`, { orderId: orderId }, { headers })
export const orderValidation = (productId: string): Promise<AxiosResponse> => axios.get(`${URI}` + `/api/v1/user_order_validation?productId=${productId}`, { headers })

// wishlist
export const addToWishList = (props: WishListType): Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/add_to_wishlist', props, { headers })
export const productInWishList = (productId: string): Promise<AxiosResponse> => axios.get(`${URI}` + `/api/v1/product_in_wish_list?productId=${productId}`, { headers })
export const removeFromWishList = (props: WishListType): Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/remove_from_wishList', props, { headers })
export const getWishList = (): Promise<AxiosResponse> => axios.get(`${URI}` + '/api/v1/get_wish_list', { headers })

// Image-Uplod
export const uploadImage = (formData: FormData): 
  Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/upload', formData, { 
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }
)

// Dashboard
export const getDashboardData = (): Promise<AxiosResponse> => axios.get(`${URI}` + '/api/v1/admin/get_dashboard_data', { headers })
export const getUsers = (searchTerm: string, currentPage: number): Promise<AxiosResponse> => {
  const url = searchTerm ? `${URI}/api/v1/admin/get_all_users?searchTerm=${searchTerm}&page=${currentPage}` : `${URI}/api/v1/admin/get_all_users?page=${currentPage}`
  return axios.get(url, { headers })
}
export const updateUserDetails = (props: object): Promise<AxiosResponse> => axios.put(`${URI}` + '/api/v1/admin/update_user', props, { headers })
export const addProduct = (props: ProductProps): Promise<AxiosResponse> => axios.post(`${URI}` + '/api/v1/admin/add_product', props, { headers })
export const getProducts = (searchTerm: string, page: number): Promise<AxiosResponse> => {
  const url = searchTerm ? `${URI}/api/v1/admin/get_products?searchTerm=${searchTerm}&page=${page}` : `${URI}/api/v1/admin/get_products?page=${page}`
  return axios.get(url, { headers })
}
export const updateProduct = (props: ProductProps): Promise<AxiosResponse> => axios.put(`${URI}` + '/api/v1/admin/update_product', props, { headers })
export const deleteProduct = (productId: string): Promise<AxiosResponse> => axios.delete(`${URI}` + `/api/v1/admin/delete_product?productId=${productId}`, { headers })
export const getOrders = (searchTerm: string, page: number): Promise<AxiosResponse> => {
  const url = searchTerm ? `${URI}/api/v1/admin/get_orders?searchTerm=${searchTerm}&page=${page}` : `${URI}/api/v1/admin/get_orders?page=${page}`
  return axios.get(url, { headers })
}
export const updateUserOrder = (status:string, orderId: string): Promise<AxiosResponse> => axios.put(`${URI}/api/v1/admin/update_order`, { status: status, orderId: orderId }, { headers })