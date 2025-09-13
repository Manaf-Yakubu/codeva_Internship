import { apiCall, API_ENDPOINTS } from './api'

// User service for JSONPlaceholder API
export const userService = {
  // Get all users
  getAllUsers: async () => {
    const url = `${API_ENDPOINTS.USERS}/users`
    return await apiCall(url)
  },

  // Get user by ID
  getUserById: async (id) => {
    const url = `${API_ENDPOINTS.USERS}/users/${id}`
    return await apiCall(url)
  },

  // Get user posts
  getUserPosts: async (userId) => {
    const url = `${API_ENDPOINTS.USERS}/posts`
    const params = { userId }
    return await apiCall(url, { params })
  },

  // Get user albums
  getUserAlbums: async (userId) => {
    const url = `${API_ENDPOINTS.USERS}/albums`
    const params = { userId }
    return await apiCall(url, { params })
  },

  // Get user todos
  getUserTodos: async (userId) => {
    const url = `${API_ENDPOINTS.USERS}/todos`
    const params = { userId }
    return await apiCall(url, { params })
  },

  // Create new user (POST request)
  createUser: async (userData) => {
    const url = `${API_ENDPOINTS.USERS}/users`
    return await apiCall(url, {
      method: 'POST',
      data: userData
    })
  },

  // Update user (PUT request)
  updateUser: async (id, userData) => {
    const url = `${API_ENDPOINTS.USERS}/users/${id}`
    return await apiCall(url, {
      method: 'PUT',
      data: userData
    })
  },

  // Delete user (DELETE request)
  deleteUser: async (id) => {
    const url = `${API_ENDPOINTS.USERS}/users/${id}`
    return await apiCall(url, {
      method: 'DELETE'
    })
  },

  // Get posts with comments
  getPostsWithComments: async (limit = 10) => {
    const postsResult = await apiCall(`${API_ENDPOINTS.USERS}/posts`, {
      params: { _limit: limit }
    })
    
    if (postsResult.error) return postsResult

    const posts = postsResult.data
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const commentsResult = await apiCall(`${API_ENDPOINTS.USERS}/posts/${post.id}/comments`)
        return {
          ...post,
          comments: commentsResult.data || []
        }
      })
    )

    return { data: postsWithComments, error: null }
  },

  // Search users by name or email
  searchUsers: async (query) => {
    const usersResult = await apiCall(`${API_ENDPOINTS.USERS}/users`)
    
    if (usersResult.error) return usersResult

    const filteredUsers = usersResult.data.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase())
    )

    return { data: filteredUsers, error: null }
  }
}

export default userService
