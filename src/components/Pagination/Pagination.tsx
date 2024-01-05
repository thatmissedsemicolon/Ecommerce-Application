import React from "react"
import { PaginationProps } from "../../utils/types"

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center mt-4">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`mx-1 px-4 py-2 rounded-md text-sm font-medium ${
            currentPage === page
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}

export default Pagination