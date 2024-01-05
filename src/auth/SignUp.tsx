import React, { 
  useState,
  useEffect,
  ChangeEvent, 
  FormEvent 
} from 'react'

import { 
  SignUpProps,
  ErrorResponse 
} from '../utils/types'

import { signUp } from '../api'
import { AxiosError } from 'axios'
import Eshop from '../assets/login_logo.png'

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignUpProps>({ name: '', email: '', password: '', repeat_password: '' })
  const [redirect, setRedirect] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (formData.name && formData.email && formData.password && formData.repeat_password) {
      const body = { ...formData }
      try {
        const { data } = await signUp(body)
        if (data) { 
          window.location.href = `${redirect ? `/${redirect}` : '/signin'}`
          setError(null)
        }
      } catch (error) {
        const axiosError = error as AxiosError
        setError((axiosError.response?.data as ErrorResponse)?.message || "An error occurred")
      }
    } else {
      setError("Invalid Credentials!")
    }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const redirect = urlParams.get('redirect')

    setRedirect(redirect)
  }, [])

  return (
    <section className='bg-gray-100 h-[100%]'>
      <div className='bg-white flex flex-col justify-center items-center mx-auto sm:px-6 lg:px-8 px-4 md:mt-0 pt-8 pb-12'>
        <a href='/' className='mb-4 flex items-start justify-start'>
          <img src={Eshop} alt="E-shop" className='h-[80px] pointer-events-none'/>
        </a>
        <form onSubmit={onSubmit} className='bg-white shadow-lg px-6 py-4 w-[400px] border-2'>
          <h1 className='font-semibold text-2xl'>Create account</h1>
          <div className='flex flex-col py-6 gap-2 text-md'>
            <label htmlFor="name" className="text-sm font-semibold">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="name"
              onChange={handleChangeInput}
              required
              className={'mb-2 px-2 py-2 text-sm border-2 w-full rounded-[4px] focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:z-10'}
            />
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete='email'
              onChange={handleChangeInput}
              required
              className={'mb-2 px-2 py-2 text-sm border-2 w-full rounded-[4px] focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:z-10'}
            />
            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChangeInput}
              required
              className={'px-2 py-2 text-sm border-2 w-full rounded-[4px] focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:z-10'}
            />
            <label htmlFor="password" className="text-sm font-semibold">
              Re-enter password
            </label>
            <input
              id="repeat_password"
              name="repeat_password"
              type="password"
              onChange={handleChangeInput}
              required
              className={'px-2 py-2 text-sm border-2 w-full rounded-[4px] focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:z-10'}
            />
            {error && <p className='text-start text-red-500 font-semibold text-sm'>{error}</p>}
            <button className='mt-4 bg-blue-600 w-full rounded-[4px] flex px-4 py-2 justify-center items-center text-white hover:bg-blue-500'>Sign up</button>
          </div>
          <div className='text-end'>
            <a href={redirect ? `/signin?redirect=${redirect}` : '/signin'} className='text-sm text-blue-600 font-semibold hover:text-blue-500'>Already have an account?</a>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Signup