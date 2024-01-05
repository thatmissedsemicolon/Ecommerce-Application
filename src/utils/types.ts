export type ErrorResponse = {
  message: string
}

export type LoaderProps = {
  className: string
}

export type PaginationProps = {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export type FormFieldValue = string | number | boolean | string[] | undefined

const formFields = ['name', 'email', 'password'] as const

export type FormFieldKey = typeof formFields[number]

export type UserProps = {
  _id: string
  name: string
  email: string
  user_email_verified: boolean
  user_is_admin: boolean
  user_account_is_active: boolean,
  account_created_timestamp: number,
  last_login_timestamp: number,
  expires: number
}

export type SignInProps = {
  email: string
  password: string
}

export type SignUpProps = SignInProps & {
  name: string
  repeat_password: string
}

export type BaseContextType<T> = {
  user: T
}

export type UserContextType = BaseContextType<UserProps | null>

export type DashboardProps = BaseContextType<UserProps | null>

export type HomeRoutesProps = BaseContextType<UserProps | null>

export type HeaderProps = {
  user: UserProps | null
  setSearchTerm: (term: string) => void
}

export type CartItem = {
  _id: string
  quantity: number
}

export type CartContextType = {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

export type Reviews = {
  name: string
  rating: number
  comment: string
  userId: string
}

export type ProductType = {
  _id: string
  title: string
  description: string
  price: number
  discount_percentage: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  average_rating?: string
  quantity?: number
  reviews: Reviews[]
}

export type ProductProps = ProductType

export type ProductCardProps = {
  product: ProductProps
  category: string
  addToCart: (product: ProductProps) => void
}

export type ProductDetailsProps = {
  user: UserProps | null
}

export type SearchTermProps = {
  searchTerm: string
}

export type RecommendationProps = {
  category: string
  productId: string
  addToCart: (product: ProductProps) => void
}

export type CategoryItemProps = {
  href: string
  imgUrl: string
  altText: string
  label: string
}

export type CategoryProps = {
  title: string
  items: CategoryItemProps[];
}

export type OrderProps = {
  _id: string
  userId: string
  email: string
  items: CartItem[] | ProductProps[]
  status: string
  total: number
  date: string
  error?: string
}

export type ManageOrderProps = {
  orders: OrderProps[]
  total_pages: number
}

export type WishListType = {
  _id?: string
  productId: string
  userId: string
  products?: string[]
}

export type WishListProps = {
  user: UserProps | null
}

export type AddReviewProps = Reviews & {
  productId: string
}

export type FormFieldProps = {
  type: 'text' | 'number' | 'textarea' | 'email' | 'password'
  id: string
  label: string
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  min?: number
  max?: number
  required?: boolean
  rows?: number
}

export type ProductFormField<T = FormFieldValue> = {
  name: string
  label: string
  type: 'text' | 'number' | 'textarea' | 'select' | 'file'
  options?: Array<T>
  placeholder?: string
  className: string
}

export type ProductFormConfig<T> = {
  text: string
  fields: ProductFormField[]
  initialValues: T
  onSubmit: (values: T) => void
}

export type ProductFormProps = ProductType & {
  [key: string]: string | number | string[]
}

export type CartItemsComponentProps = {
  products: ProductType[]
  removeFromCart: (productId: string) => void
  getTotal: () => string
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
  purchase: (e: React.FormEvent<HTMLButtonElement>) => Promise<void>
}

export type CartItemComponentProps = {
  item: ProductProps
  removeFromCart: (productId: string) => void
  increaseQuantity: (productId: string) => void
  decreaseQuantity: (productId: string) => void
}

export type TotalComponentProps = {
  total: string
  purchase: (e: React.FormEvent<HTMLButtonElement>) => Promise<void>
}

export type CartProps = {
  user: UserProps | null
}

export type AccountCardProps = {
  title: string
  body: string
  icon: React.ReactNode
  route: string
}

export type LoginAndSecurityProps = {
  user: UserProps | null
}

export type LoginandSecurity = {
  name: string
  email: string
  password: string
}

export type PublicRouteProps = {
  children: React.ReactNode
}

export type ProtectedRouteProps = {
  user: UserProps | null
  children: React.ReactNode
}

export type OrderConfirmationProps = {
  user: UserProps | null
}

export type DashboardCardProps = {
  title: string
  value: number | string
  bgColor: string
}

export type DashboardSales = {
  year_month: string
  total_sales: number
}