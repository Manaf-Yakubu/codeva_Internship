import { apiCall, API_ENDPOINTS } from './api'

// GitHub service for GitHub REST API
export const githubService = {
  // Get user profile
  getUserProfile: async (username) => {
    const url = `${API_ENDPOINTS.GITHUB}/users/${username}`
    return await apiCall(url)
  },

  // Get user repositories
  getUserRepos: async (username, options = {}) => {
    const url = `${API_ENDPOINTS.GITHUB}/users/${username}/repos`
    const params = {
      sort: 'updated',
      direction: 'desc',
      per_page: 10,
      ...options
    }
    return await apiCall(url, { params })
  },

  // Get repository details
  getRepository: async (owner, repo) => {
    const url = `${API_ENDPOINTS.GITHUB}/repos/${owner}/${repo}`
    return await apiCall(url)
  },

  // Get repository languages
  getRepoLanguages: async (owner, repo) => {
    const url = `${API_ENDPOINTS.GITHUB}/repos/${owner}/${repo}/languages`
    return await apiCall(url)
  },

  // Get repository commits
  getRepoCommits: async (owner, repo, options = {}) => {
    const url = `${API_ENDPOINTS.GITHUB}/repos/${owner}/${repo}/commits`
    const params = {
      per_page: 10,
      ...options
    }
    return await apiCall(url, { params })
  },

  // Get user's public events
  getUserEvents: async (username) => {
    const url = `${API_ENDPOINTS.GITHUB}/users/${username}/events/public`
    const params = { per_page: 10 }
    return await apiCall(url, { params })
  },

  // Search repositories
  searchRepositories: async (query, options = {}) => {
    const url = `${API_ENDPOINTS.GITHUB}/search/repositories`
    const params = {
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: 10,
      ...options
    }
    return await apiCall(url, { params })
  },

  // Search users
  searchUsers: async (query, options = {}) => {
    const url = `${API_ENDPOINTS.GITHUB}/search/users`
    const params = {
      q: query,
      sort: 'followers',
      order: 'desc',
      per_page: 10,
      ...options
    }
    return await apiCall(url, { params })
  },

  // Get trending repositories (using search with recent activity)
  getTrendingRepos: async (language = '', timeframe = 'week') => {
    const date = new Date()
    date.setDate(date.getDate() - (timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : 1))
    const dateString = date.toISOString().split('T')[0]
    
    const query = `created:>${dateString}${language ? ` language:${language}` : ''}`
    
    return await githubService.searchRepositories(query, {
      sort: 'stars',
      order: 'desc'
    })
  },

  // Get repository README
  getRepoReadme: async (owner, repo) => {
    const url = `${API_ENDPOINTS.GITHUB}/repos/${owner}/${repo}/readme`
    return await apiCall(url)
  },

  // Get repository issues
  getRepoIssues: async (owner, repo, options = {}) => {
    const url = `${API_ENDPOINTS.GITHUB}/repos/${owner}/${repo}/issues`
    const params = {
      state: 'open',
      per_page: 10,
      ...options
    }
    return await apiCall(url, { params })
  },

  // Get repository pull requests
  getRepoPullRequests: async (owner, repo, options = {}) => {
    const url = `${API_ENDPOINTS.GITHUB}/repos/${owner}/${repo}/pulls`
    const params = {
      state: 'open',
      per_page: 10,
      ...options
    }
    return await apiCall(url, { params })
  },

  // Get user's followers
  getUserFollowers: async (username) => {
    const url = `${API_ENDPOINTS.GITHUB}/users/${username}/followers`
    const params = { per_page: 10 }
    return await apiCall(url, { params })
  },

  // Get user's following
  getUserFollowing: async (username) => {
    const url = `${API_ENDPOINTS.GITHUB}/users/${username}/following`
    const params = { per_page: 10 }
    return await apiCall(url, { params })
  },

  // Get user's starred repositories
  getUserStarred: async (username) => {
    const url = `${API_ENDPOINTS.GITHUB}/users/${username}/starred`
    const params = { per_page: 10 }
    return await apiCall(url, { params })
  },

  // Get comprehensive user data (profile + repos + activity)
  getCompleteUserData: async (username) => {
    try {
      const [profileResult, reposResult, eventsResult] = await Promise.all([
        githubService.getUserProfile(username),
        githubService.getUserRepos(username, { per_page: 6 }),
        githubService.getUserEvents(username)
      ])

      return {
        data: {
          profile: profileResult.data,
          repositories: reposResult.data,
          events: eventsResult.data
        },
        error: profileResult.error || reposResult.error || eventsResult.error
      }
    } catch (error) {
      return {
        data: null,
        error: {
          message: 'Failed to fetch complete user data',
          status: 500,
          code: 'FETCH_ERROR'
        }
      }
    }
  }
}

export default githubService
