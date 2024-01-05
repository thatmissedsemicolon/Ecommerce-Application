import React, { 
  useState, 
  useEffect, 
  useRef, 
  FormEvent 
} from 'react'

import { 
  signIn, 
  validateUserEmail 
} from '../api'

import { ErrorResponse } from '../utils/types'
import { AxiosError } from 'axios'
import Eshop from '../assets/login_logo.png'

const SignIn = () => {
  const [email, setEmail] = useState<string>('')
  const [validation, setValidation] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<string | null>(null)
  const [error, setError] = useState<string | boolean>()
  const passwordRef = useRef<HTMLInputElement>(null)

  const validateEmail = async (e: FormEvent) => {
    e.preventDefault()

    if (email) {
      try {
        const { data } = await validateUserEmail(email)
        if (data?.message) {
          setValidation(true)
          setError(false)
        }
      } catch (error) {
        setError(true && 'Email does not exist!')
      }
    } else {
      setError("Please enter a valid email!")
    }
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const password = passwordRef.current?.value

    if (email && password) {
      try {
        const { data } = await signIn({ email, password })

        if (data) {
          localStorage.setItem("access_token", data?.access_token)
          if (redirect) window.location.href = `${redirect ? `/${redirect}` : '/'}`
          else window.location.href = '/'
        }
      } catch (error) {
        const axiosError = error as AxiosError
        const errorMsg = (axiosError.response?.data as ErrorResponse)?.message || "An error occurred"
        setError(errorMsg)
      }
    } else {
      setError(true && 'Password is Required!')
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
          <img src={Eshop} alt="E-Shop" className='h-[80px] pointer-events-none'/>
        </a>
        <form className='bg-white shadow-lg px-6 py-4 w-[400px] border-2'>
          <h1 className='font-semibold text-2xl'>Sign in</h1>
          <div className='flex flex-col py-6 gap-2 text-md'>
            <label htmlFor="email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={validation}
              className='mb-2 px-2 py-2 text-sm border-2 w-full rounded-[4px] focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:z-10'
            />
            {validation && (
              <React.Fragment>
                <label htmlFor="password" className="text-sm font-semibold">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={passwordRef}
                  autoComplete='current-password'
                  required
                  className={'px-2 py-2 text-sm border-2 w-full rounded-[4px] focus:ring-blue-500 focus:border-blue-500 focus:outline-none focus:z-10'}
                />
              </React.Fragment>
            )}
            {error && <p className='text-start text-red-500 font-semibold text-sm'>{error}</p>}
            <button onClick={validation ? onSubmit : validateEmail} className={validation ? 'bg-blue-600 w-full rounded-[4px] flex px-4 py-2 justify-center items-center text-white hover:bg-blue-500 mt-4' : 'bg-blue-600 w-full rounded-[4px] flex px-4 py-2 justify-center items-center text-white hover:bg-blue-500'}>{validation ? "Sign in" : "Continue" }</button>
          </div>
        </form>
        <div className='mt-8 flex flex-row'>
          <hr className='mt-2.5 border-gray-500 w-32'/>&nbsp; <p className='text-sm font-semibold'>New to E-shop?</p> &nbsp;<hr className='mt-2.5 border-gray-500 w-32'/>
        </div>
        <div className='mt-2 flex flex-col'>
          <a href={redirect ? `/signup?redirect=${redirect}` : '/signup'} className='bg-gray-200 w-[350px] text-black font-semibold rounded-md flex px-4 py-2 justify-center items-center hover:bg-gray-100'>Create your E-shop account</a>
        </div>
      </div>
    </section>
  )
}

export default SignIn
