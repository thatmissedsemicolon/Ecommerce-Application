import React, { 
  useState, 
  useEffect, 
  useCallback 
} from 'react'

import { 
  getUsers, 
  updateUserDetails 
} from '../../api'

import { UserProps } from '../../utils/types'
import { Pagination } from '../../components'
import Loader from '../../utils/Loader'

const ManagerUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredUsers, setFilteredUsers] = useState<UserProps[]>([])

  const handleUpdateUser = async (email: string, field: string, value: boolean) => {
    try {
      const payload = { email: email, [field]: value }

      const { data } = await updateUserDetails(payload)
  
      if (data) {
        setUsers(users.map(user => 
          user.email === email ? { ...user, [field]: value } : user
        ))
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  const handlePageChange = (page: number) => setCurrentPage(page)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    const { data } = await getUsers('', currentPage)
    if (data) { 
      setUsers(data.users)
      setTotalPages(data.total_pages)
    }
    setLoading(false)
  }, [currentPage])

  const performSearch = useCallback(async () => {
    setLoading(true)
    const { data } = await getUsers(searchQuery, currentPage)
    if (data) {
      setFilteredUsers(data.users)
      setTotalPages(data.total_pages)
    }
    setLoading(false)
  }, [searchQuery, currentPage])

  useEffect(() => {
    if (searchQuery && searchQuery.length > 4) {
      performSearch()
    } else if (!searchQuery) {
      fetchUser()
    }
  }, [searchQuery, fetchUser, performSearch])

  const usersToShow = searchQuery.length > 4 ? filteredUsers : users

  return (
    <div className="container mx-auto p-4">
      <div className='flex flex-wrap justify-between items-center'>
        <h1 className='font-bold text-2xl'>Manage Users</h1>
        <input
          type="text"
          placeholder="Search users by email"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          className="mb-4 p-2 border rounded-lg"
        />
      </div>
      <table className="table-auto w-full text-left whitespace-no-wrap">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50 border">
            <th className="px-4 py-3">User ID</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Admin</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Last Login</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y border">
          {usersToShow.map(user => (
            <tr key={user._id} className="text-gray-700">
              <td className="px-4 py-3 text-sm">{user._id}</td>
              <td className="px-4 py-3 text-sm">{user.email}</td>
              <td className="px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={user.user_is_admin}
                  onChange={(e) => handleUpdateUser(user.email, 'user_is_admin', e.target.checked)}
                  className="rounded text-blue-600"
                />
              </td>
              <td className="px-4 py-3 text-sm">
                <input
                  type="checkbox"
                  checked={user.user_account_is_active}
                  onChange={(e) => handleUpdateUser(user.email, 'user_account_is_active', e.target.checked)}
                  className="rounded text-red-600"
                />
              </td>
              <td className="px-4 py-3 text-sm">{user.last_login_timestamp}</td>
            </tr>
           ))}
        </tbody>
       </table>
       {loading && <Loader className='flex flex-col justify-center items-center h-screen' />}
       <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
       />
    </div>
  )
}

export default ManagerUsers
