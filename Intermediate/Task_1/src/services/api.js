import axios from 'axios'

// Create axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// API endpoints
export const API_ENDPOINTS = {
  WEATHER: 'https://api.openweathermap.org/data/2.5',
  USERS: 'https://jsonplaceholder.typicode.com',
  QUOTES: 'https://api.quotable.io',
  GITHUB: 'https://api.github.com'
}

// API keys (these should be in environment variables in production)
export const API_KEYS = {
  WEATHER: 'demo_key', // Replace with actual API key
}

// Generic API call function
export const apiCall = async (url, options = {}) => {
  try {
    const response = await api({
      url,
      method: 'GET',
      ...options,
    })
    return { data: response.data, error: null }
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.response?.data?.message || error.message || 'An error occurred',
        status: error.response?.status || 500,
        code: error.code || 'UNKNOWN_ERROR'
      }
    }
  }
}

export default api
