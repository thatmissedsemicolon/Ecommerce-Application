import React, { 
  useState, 
  useEffect 
} from 'react'

import { useNavigate } from 'react-router-dom'

import { 
  PublicRouteProps, 
  ProtectedRouteProps, 
  UserProps 
} from '../utils/types'

import { token } from '../api'
import Loader from '../utils/Loader'

const useAuthRedirect = (user: UserProps | null, isLoadingInitial = true) => {
  const [isLoading, setIsLoading] = useState(isLoadingInitial)
  const navigate = useNavigate()

  useEffect(() => {
    if (user !== null) {
      setIsLoading(false)
    }
  }, [user])

  return { isLoading, navigate }
};

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  if (token) {
    return window.location.href = '/'
  }

  return children
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  const { isLoading, navigate } = useAuthRedirect(user)

  if (isLoading) {
    return <Loader className='flex flex-col justify-center items-center h-screen' />
  }

  if (!user) {
    navigate('/signin')
    return null
  }

  return children
}

export const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, children }) => {
  const { isLoading, navigate } = useAuthRedirect(user)

  if (isLoading) {
    return <Loader className='flex flex-col justify-center items-center h-screen' />
  }

  if (!user || !user.user_is_admin) {
    navigate('/')
    return null
  }

  return children
}
