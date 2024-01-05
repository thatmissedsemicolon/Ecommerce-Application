import React, { 
  createContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react'

import { 
  UserProps, 
  UserContextType 
} from '../utils/types'

import { 
  token,
  getUser 
} from '../api'

import { withErrorHandler } from '../utils'

export const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(null)

  useEffect(() => {
    const fetchUserAsync = async () => {
      const { data } = await getUser()
      if (data) { 
        setUser(data)
      }
    }
    
    if (token) withErrorHandler(fetchUserAsync)()
  }, [])

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  )
}
