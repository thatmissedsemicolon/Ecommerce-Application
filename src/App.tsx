import React, { useContext } from 'react'

import { 
  Route, 
  Routes 
} from 'react-router-dom'

import {
  SignIn,
  SignUp
} from './auth'

import { 
  PublicRoute,
  AdminProtectedRoute
} from './routes'

import { UserContext } from './context/UserContext'
import { UserContextType } from './utils/types'

import HomeRoutes from './routes/HomeRoutes'
import DashboardRoutes from './routes/DashboardRoutes'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const { user } = useContext(UserContext) as UserContextType

  return (
    <React.Fragment>
      <ToastContainer />
      <Routes>
        <Route path='/*' element={<HomeRoutes user={user} />} />
        <Route path='/signin' element={<PublicRoute><SignIn /></PublicRoute>} />
        <Route path='/signup' element={<PublicRoute><SignUp /></PublicRoute>} />
        <Route path='/dashboard/*' element={<AdminProtectedRoute user={user}><DashboardRoutes user={user} /></AdminProtectedRoute>} />
      </Routes>
    </React.Fragment>
  )
}

export default App
