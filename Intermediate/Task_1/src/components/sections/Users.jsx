import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import userService from '../../services/userService'
import Card from '../common/Card'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import './Users.css'

const Users = () => {
  const { state, setLoading, setError, setData } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [userPosts, setUserPosts] = useState([])

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading('users', true)
    setError('users', null)

    try {
      const result = await userService.getAllUsers()
      
      if (result.error) {
        setError('users', result.error.message)
        return
      }

      setData('users', result.data)
    } catch (error) {
      setError('users', 'Failed to fetch users')
    } finally {
      setLoading('users', false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchUsers()
      return
    }

    setLoading('users', true)
    try {
      const result = await userService.searchUsers(searchQuery)
      if (result.error) {
        setError('users', result.error.message)
      } else {
        setData('users', result.data)
      }
    } catch (error) {
      setError('users', 'Search failed')
    } finally {
      setLoading('users', false)
    }
  }

  const handleUserSelect = async (user) => {
    setSelectedUser(user)
    
    try {
      const postsResult = await userService.getUserPosts(user.id)
      if (postsResult.data) {
        setUserPosts(postsResult.data.slice(0, 3)) // Show only first 3 posts
      }
    } catch (error) {
      console.error('Failed to fetch user posts:', error)
    }
  }

  const closeUserModal = () => {
    setSelectedUser(null)
    setUserPosts([])
  }

  if (state.loading.users) {
    return (
      <section id="users" className="users">
        <div className="container">
          <div className="users__header">
            <h2 className="users__title">User Management</h2>
          </div>
          <div className="loading-container">
            <LoadingSpinner size="large" color="secondary" text="Loading users..." />
          </div>
        </div>
      </section>
    )
  }

  if (state.errors.users) {
    return (
      <section id="users" className="users">
        <div className="container">
          <div className="users__header">
            <h2 className="users__title">User Management</h2>
          </div>
          <div className="error-container">
            <h3>Failed to Load Users</h3>
            <p>{state.errors.users}</p>
            <Button variant="secondary" onClick={fetchUsers}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const users = state.data.users || []

  return (
    <section id="users" className="users">
      <div className="container">
        <div className="users__header">
          <h2 className="users__title">User Management System</h2>
          <p className="users__subtitle">
            Explore user profiles and manage user data with JSONPlaceholder API integration
          </p>
        </div>

        <div className="users__controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search users by name, email, or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="search-input"
            />
            <Button variant="secondary" onClick={handleSearch}>
              Search
            </Button>
          </div>
          <Button variant="outline" onClick={fetchUsers}>
            Show All Users
          </Button>
        </div>

        <div className="users__content">
          <div className="users__stats">
            <Card variant="outlined" className="stats-card">
              <div className="stats-content">
                <div className="stat-item">
                  <span className="stat-number">{users.length}</span>
                  <span className="stat-label">Total Users</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{users.filter(u => u.website).length}</span>
                  <span className="stat-label">With Websites</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{users.filter(u => u.company).length}</span>
                  <span className="stat-label">With Companies</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="users__grid">
            {users.map((user) => (
              <Card 
                key={user.id}
                variant="elevated"
                hoverable
                className="user-card"
                onClick={() => handleUserSelect(user)}
              >
                <div className="user-card__content">
                  <div className="user-avatar">
                    <span className="avatar-text">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="user-info">
                    <h3 className="user-name">{user.name}</h3>
                    <p className="user-username">@{user.username}</p>
                    <p className="user-email">{user.email}</p>
                    <div className="user-details">
                      <span className="user-detail">📍 {user.address?.city}</span>
                      {user.website && (
                        <span className="user-detail">🌐 {user.website}</span>
                      )}
                      {user.company && (
                        <span className="user-detail">🏢 {user.company.name}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selectedUser && (
          <div className="user-modal-overlay" onClick={closeUserModal}>
            <div className="user-modal" onClick={(e) => e.stopPropagation()}>
              <div className="user-modal__header">
                <h3>User Details</h3>
                <button className="close-button" onClick={closeUserModal}>×</button>
              </div>
              
              <div className="user-modal__content">
                <div className="user-profile">
                  <div className="user-avatar large">
                    <span className="avatar-text">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="user-profile-info">
                    <h4>{selectedUser.name}</h4>
                    <p>@{selectedUser.username}</p>
                    <p>{selectedUser.email}</p>
                    <p>📞 {selectedUser.phone}</p>
                  </div>
                </div>

                <div className="user-sections">
                  <div className="user-section">
                    <h5>Address</h5>
                    <p>
                      {selectedUser.address?.street}, {selectedUser.address?.suite}<br/>
                      {selectedUser.address?.city}, {selectedUser.address?.zipcode}
                    </p>
                  </div>

                  {selectedUser.company && (
                    <div className="user-section">
                      <h5>Company</h5>
                      <p><strong>{selectedUser.company.name}</strong></p>
                      <p>{selectedUser.company.catchPhrase}</p>
                      <p><em>"{selectedUser.company.bs}"</em></p>
                    </div>
                  )}

                  {userPosts.length > 0 && (
                    <div className="user-section">
                      <h5>Recent Posts</h5>
                      <div className="user-posts">
                        {userPosts.map((post) => (
                          <div key={post.id} className="post-item">
                            <h6>{post.title}</h6>
                            <p>{post.body.substring(0, 100)}...</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Users
