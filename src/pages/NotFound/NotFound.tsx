import React from 'react'

const NotFound: React.FC = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen bg-gray-100'>
      <h1 className='text-3xl font-semibold text-gray-800 mb-2'>Oops! Page Not Found</h1>
      <p className='text-gray-600 mb-4'>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <button 
        onClick={() => window.location.href = '/'} 
        className='px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition duration-300'
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound
