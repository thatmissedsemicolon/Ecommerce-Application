import React, { useState } from 'react'

import { 
  LoginAndSecurityProps,
  FormFieldKey, 
  LoginandSecurity, 
  ErrorResponse
} from '../../utils/types'

import { 
  deleteUser, 
  signOut, 
  updateUser 
} from '../../api'

import { FormField } from '../../components'
import { AxiosError } from 'axios'

const LoginAndSecurity: React.FC<LoginAndSecurityProps> = ({ user }) => {
  const [formData, setFormData] = useState<LoginandSecurity>({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  })
  const [error, setError] = useState<string | null>(null)

  document.title = "Account Settings"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const field = target.id as keyof LoginandSecurity

    setFormData({
      ...formData,
      [field]: target.value
    })
  }  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
    const isDataChanged = formData.name !== user?.name || 
                          formData.email !== user?.email || 
                          (formData.password && formData.password.trim() !== '')
              
    const isEmailValid = emailRegex.test(formData.email)
  
    if (!isDataChanged) {
      setError('No changes to update.')
      return
    }
  
    if (!isEmailValid) {
      setError('Please enter a valid email address.')
      return
    }
  
    try {
      const { data } = await updateUser(formData)
      if (data) {
        alert(data.message)
        signOut()
      } 
    } catch (error) {
      const axiosError = error as AxiosError
      setError((axiosError.response?.data as ErrorResponse)?.message || "An error occurred")
    }
  }

  const handleDeleteAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (window.confirm('Are you sure you want to delete your account?')) {
      const { data } = await deleteUser()
      
      if (data) window.location.href = '/'
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'password'].map((field) => (
            <FormField
              key={field}
              type={field === 'password' ? 'password' : 'text'}
              id={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field as FormFieldKey]}
              onChange={handleInputChange}
            />
          ))}
          <button
            type="submit"
            className="w-full py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Account
          </button>
        </form>
        <button
          onClick={handleDeleteAccount}
          className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete Account
        </button>
        {error && <p className='text-start text-red-500 font-semibold text-sm mt-4'>{error}</p>}
      </div>
    </div>
  )
}

export default LoginAndSecurity
