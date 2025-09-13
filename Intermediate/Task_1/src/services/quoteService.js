import { apiCall, API_ENDPOINTS } from './api'

// Quote service for Quotable API
export const quoteService = {
  // Get random quote
  getRandomQuote: async () => {
    const url = `${API_ENDPOINTS.QUOTES}/random`
    return await apiCall(url)
  },

  // Get multiple random quotes
  getRandomQuotes: async (limit = 5) => {
    const url = `${API_ENDPOINTS.QUOTES}/quotes/random`
    const params = { limit }
    return await apiCall(url, { params })
  },

  // Get quotes by author
  getQuotesByAuthor: async (author) => {
    const url = `${API_ENDPOINTS.QUOTES}/quotes`
    const params = { author }
    return await apiCall(url, { params })
  },

  // Get quotes by tag
  getQuotesByTag: async (tag) => {
    const url = `${API_ENDPOINTS.QUOTES}/quotes`
    const params = { tags: tag }
    return await apiCall(url, { params })
  },

  // Search quotes
  searchQuotes: async (query) => {
    const url = `${API_ENDPOINTS.QUOTES}/search/quotes`
    const params = { query }
    return await apiCall(url, { params })
  },

  // Get all authors
  getAuthors: async () => {
    const url = `${API_ENDPOINTS.QUOTES}/authors`
    return await apiCall(url)
  },

  // Get all tags
  getTags: async () => {
    const url = `${API_ENDPOINTS.QUOTES}/tags`
    return await apiCall(url)
  },

  // Get inspirational quotes (filtered by tags)
  getInspirationalQuotes: async (limit = 10) => {
    const url = `${API_ENDPOINTS.QUOTES}/quotes`
    const params = { 
      tags: 'inspirational|motivational|success|wisdom',
      limit 
    }
    return await apiCall(url, { params })
  },

  // Get Ghana-related or African quotes
  getAfricanQuotes: async () => {
    // Since the API might not have specific Ghana quotes, we'll search for African wisdom
    const searchTerms = ['africa', 'african', 'wisdom', 'ubuntu']
    const results = []
    
    for (const term of searchTerms) {
      const result = await apiCall(`${API_ENDPOINTS.QUOTES}/search/quotes`, {
        params: { query: term, limit: 3 }
      })
      if (result.data && result.data.results) {
        results.push(...result.data.results)
      }
    }
    
    // If no results, return some default inspirational quotes
    if (results.length === 0) {
      return await quoteService.getInspirationalQuotes(5)
    }
    
    return { data: { results }, error: null }
  },

  // Get quote of the day
  getQuoteOfTheDay: async () => {
    // Use date as seed for consistent daily quote
    const today = new Date().toDateString()
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    
    const url = `${API_ENDPOINTS.QUOTES}/random`
    const params = { tags: 'wisdom|inspirational|motivational' }
    return await apiCall(url, { params })
  },

  // Get quotes by length
  getQuotesByLength: async (minLength = 50, maxLength = 200) => {
    const url = `${API_ENDPOINTS.QUOTES}/quotes`
    const params = { 
      minLength,
      maxLength,
      limit: 10
    }
    return await apiCall(url, { params })
  }
}

export default quoteService
