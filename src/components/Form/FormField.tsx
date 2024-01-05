import React from 'react'
import { FormFieldProps } from '../../utils/types'

const FormField: React.FC<FormFieldProps> = ({ type, id, label, value, onChange, min, max, required, rows }) => {
  return (
    <div className='mt-2'>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded-md mt-1"
          required={required}
          rows={rows || 3}
        ></textarea>
      ) : (
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded-md mt-1"
          min={min}
          max={max}
          required={required}
        />
      )}
    </div>
  )
}

export default FormField
