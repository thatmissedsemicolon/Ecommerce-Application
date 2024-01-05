import React from 'react'
import { LoaderProps } from './types'

const Loader: React.FC<LoaderProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin"></div>
    </div>
  )
}

export default Loader