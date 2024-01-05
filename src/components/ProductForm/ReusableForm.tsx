import { 
  useState,
  useEffect,
  useRef,
  ChangeEvent, 
  FormEvent
} from 'react'

import { 
  ProductFormField, 
  ProductFormConfig, 
  ProductFormProps,
  ErrorResponse 
} from '../../utils/types'

import { uploadImage } from '../../api'
import { AxiosError } from 'axios'

const ReusableForm = ({ text, fields, initialValues, onSubmit }: ProductFormConfig<ProductFormProps>) => {
  const [formData, setFormData] = useState<ProductFormProps>(initialValues)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (e.target.type === 'number' && value !== '') setFormData({ ...formData, [name]: Number(value) })
    else setFormData({ ...formData, [name]: value })
  }

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData(initialValues)
    resetFileInput()
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, name: string) => {
    const file = event.target.files ? event.target.files[0] : null
  
    if (file && file.size < 500 * 1024) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data } = await uploadImage(formData)

        if (data && data.imageUrl) {
          setFormData(prevFormData => ({ 
            ...prevFormData, 
            [name]: data.imageUrl 
          }))
        }
      }
      catch (error) {
        const axiosError = error as AxiosError
        const errorMsg = (axiosError.response?.data as ErrorResponse)?.message || "An error occurred while uploading..."
        setError(errorMsg)
        resetFileInput()
      }
    } else {
      resetFileInput()
      setError('File size should be less than or equal to 500 KB')
    }
  }
  
  const renderField = (field: ProductFormField) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-gray-700 font-bold mt-2">{field.label}</label>
            <input
              className={field.className}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required
            />
          </div>
        )
      case 'textarea':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-gray-700 font-bold mt-2">{field.label}</label>
            <textarea
              className={field.className}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              required
            />
          </div>
        )
      case 'select':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-gray-700 font-bold mt-2">{field.label}</label>
            <select className={field.className} name={field.name} value={formData[field.name]} onChange={handleChange} required>
              {field.options?.map((option, i: number) => (
                <option key={i} value={String(option)}>{option}</option>
              ))}
            </select>
          </div>
        )
      case 'file':
        return (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-gray-700 font-bold mt-2">{field.label}</label>
            <div className="block w-full text-sm text-blue-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e, 'thumbnail')}
                required={text !== 'Edit Product'}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  useEffect(() => {
    setFormData(initialValues)
  }, [initialValues])

  return (
    <form onSubmit={handleSubmit} className="md:flex md:items-start md:justify-center">
      {formData.thumbnail && 
        <div className="md:flex-1 md:mr-8">
          <img src={formData.thumbnail} 
            alt='product-img' 
            className='w-full max-w-md mx-auto h-auto object-contain' 
          />
        </div>
      }
      <div className="md:flex-1">
        {fields.map(field => renderField(field))}
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          {text}
        </button>
        {error && <p className='text-start text-red-500 font-semibold text-md mt-4'>{error}</p>}
      </div>
    </form>
  )
}

export default ReusableForm
