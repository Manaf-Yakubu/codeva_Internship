import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import githubService from '../../services/githubService'
import Card from '../common/Card'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import './GitHub.css'

const GitHub = () => {
  const { state, setLoading, setError, setData } = useAppContext()
  const [searchQuery, setSearchQuery] = useState('react')
  const [searchType, setSearchType] = useState('repositories')
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    fetchTrendingRepos()
  }, [])

  const fetchTrendingRepos = async () => {
    setLoading('github', true)
    setError('github', null)

    try {
      const result = await githubService.getTrendingRepos('javascript')
      
      if (result.error) {
        setError('github', result.error.message)
        return
      }

      const repos = result.data?.items || []
      setData('github', repos.slice(0, 6))
    } catch (error) {
      setError('github', 'Failed to fetch GitHub data')
    } finally {
      setLoading('github', false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading('github', true)
    setError('github', null)

    try {
      let result
      if (searchType === 'repositories') {
        result = await githubService.searchRepositories(searchQuery)
      } else {
        result = await githubService.searchUsers(searchQuery)
      }
      
      if (result.error) {
        setError('github', result.error.message)
        return
      }

      const items = result.data?.items || []
      setData('github', items.slice(0, 6))
    } catch (error) {
      setError('github', 'Search failed')
    } finally {
      setLoading('github', false)
    }
  }

  const handleRepoSelect = async (repo) => {
    setSelectedRepo(repo)
    
    // Fetch additional repo details if needed
    try {
      const [languagesResult, commitsResult] = await Promise.all([
        githubService.getRepoLanguages(repo.owner.login, repo.name),
        githubService.getRepoCommits(repo.owner.login, repo.name, { per_page: 3 })
      ])
      
      setSelectedRepo(prev => ({
        ...prev,
        languages: languagesResult.data,
        recentCommits: commitsResult.data
      }))
    } catch (error) {
      console.error('Failed to fetch additional repo details:', error)
    }
  }

  const handleUserSelect = async (user) => {
    setLoading('github', true)
    
    try {
      const result = await githubService.getCompleteUserData(user.login)
      
      if (result.data) {
        setUserProfile({
          ...result.data.profile,
          repositories: result.data.repositories?.slice(0, 4) || [],
          events: result.data.events?.slice(0, 3) || []
        })
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    } finally {
      setLoading('github', false)
    }
  }

  const closeModal = () => {
    setSelectedRepo(null)
    setUserProfile(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (state.loading.github && !state.data.github?.length) {
    return (
      <section id="github" className="github">
        <div className="container">
          <div className="github__header">
            <h2 className="github__title">GitHub Explorer</h2>
          </div>
          <div className="loading-container">
            <LoadingSpinner size="large" color="primary" text="Loading GitHub data..." />
          </div>
        </div>
      </section>
    )
  }

  if (state.errors.github && !state.data.github?.length) {
    return (
      <section id="github" className="github">
        <div className="container">
          <div className="github__header">
            <h2 className="github__title">GitHub Explorer</h2>
          </div>
          <div className="error-container">
            <h3>GitHub Service Unavailable</h3>
            <p>{state.errors.github}</p>
            <Button variant="primary" onClick={fetchTrendingRepos}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const githubData = state.data.github || []

  return (
    <section id="github" className="github">
      <div className="container">
        <div className="github__header">
          <h2 className="github__title">GitHub Explorer</h2>
          <p className="github__subtitle">
            Discover trending repositories and explore the GitHub ecosystem
          </p>
        </div>

        <div className="github__controls">
          <div className="search-controls">
            <div className="search-type">
              <label>Search for:</label>
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
                className="search-type-select"
              >
                <option value="repositories">Repositories</option>
                <option value="users">Users</option>
              </select>
            </div>
            <div className="search-bar">
              <input
                type="text"
                placeholder={`Search ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="search-input"
              />
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>
          <Button variant="outline" onClick={fetchTrendingRepos}>
            Show Trending
          </Button>
        </div>

        <div className="github__content">
          {githubData.length > 0 ? (
            <div className="github__grid">
              {githubData.map((item) => (
                <Card 
                  key={item.id}
                  variant="elevated"
                  hoverable
                  className="github-card"
                  onClick={() => searchType === 'repositories' ? handleRepoSelect(item) : handleUserSelect(item)}
                >
                  {searchType === 'repositories' ? (
                    <div className="repo-card">
                      <div className="repo-header">
                        <h3 className="repo-name">{item.name}</h3>
                        <div className="repo-owner">
                          <img 
                            src={item.owner.avatar_url} 
                            alt={item.owner.login}
                            className="owner-avatar"
                          />
                          <span>{item.owner.login}</span>
                        </div>
                      </div>
                      <p className="repo-description">
                        {item.description || 'No description available'}
                      </p>
                      <div className="repo-stats">
                        <div className="repo-stat">
                          <span className="stat-icon">⭐</span>
                          <span>{formatNumber(item.stargazers_count)}</span>
                        </div>
                        <div className="repo-stat">
                          <span className="stat-icon">🍴</span>
                          <span>{formatNumber(item.forks_count)}</span>
                        </div>
                        {item.language && (
                          <div className="repo-stat">
                            <span className="language-dot" style={{backgroundColor: getLanguageColor(item.language)}}></span>
                            <span>{item.language}</span>
                          </div>
                        )}
                      </div>
                      <div className="repo-footer">
                        <span className="repo-updated">
                          Updated {formatDate(item.updated_at)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="user-card">
                      <div className="user-header">
                        <img 
                          src={item.avatar_url} 
                          alt={item.login}
                          className="user-avatar"
                        />
                        <div className="user-info">
                          <h3 className="user-name">{item.login}</h3>
                          <p className="user-type">{item.type}</p>
                        </div>
                      </div>
                      <div className="user-stats">
                        <div className="user-stat">
                          <span className="stat-icon">📊</span>
                          <span>Score: {Math.round(item.score || 0)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Card variant="outlined" className="no-results-card">
                <div className="no-results-content">
                  <h3>No results found</h3>
                  <p>Try a different search term or browse trending repositories.</p>
                  <Button variant="primary" onClick={fetchTrendingRepos}>
                    Show Trending Repos
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="github__info">
          <Card variant="outlined" className="github-info-card">
            <h4>About GitHub Integration</h4>
            <p>
              This section demonstrates integration with the GitHub REST API to search and 
              explore repositories and users. It showcases real-time data fetching, 
              error handling, and responsive design principles.
            </p>
            <div className="github-features">
              <div className="github-feature">
                <span className="feature-icon">🔍</span>
                <span>Search repositories and users</span>
              </div>
              <div className="github-feature">
                <span className="feature-icon">📈</span>
                <span>View trending repositories</span>
              </div>
              <div className="github-feature">
                <span className="feature-icon">📊</span>
                <span>Repository statistics and details</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Repository Modal */}
        {selectedRepo && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h3>{selectedRepo.name}</h3>
                <button className="close-button" onClick={closeModal}>×</button>
              </div>
              
              <div className="modal__content">
                <div className="repo-details">
                  <div className="repo-owner-info">
                    <img 
                      src={selectedRepo.owner.avatar_url} 
                      alt={selectedRepo.owner.login}
                      className="owner-avatar large"
                    />
                    <div>
                      <h4>{selectedRepo.owner.login}</h4>
                      <p>{selectedRepo.description}</p>
                    </div>
                  </div>

                  <div className="repo-metrics">
                    <div className="metric">
                      <span className="metric-value">⭐ {formatNumber(selectedRepo.stargazers_count)}</span>
                      <span className="metric-label">Stars</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">🍴 {formatNumber(selectedRepo.forks_count)}</span>
                      <span className="metric-label">Forks</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">👁️ {formatNumber(selectedRepo.watchers_count)}</span>
                      <span className="metric-label">Watchers</span>
                    </div>
                  </div>

                  {selectedRepo.languages && Object.keys(selectedRepo.languages).length > 0 && (
                    <div className="repo-languages">
                      <h5>Languages</h5>
                      <div className="language-list">
                        {Object.entries(selectedRepo.languages).slice(0, 5).map(([lang, bytes]) => (
                          <span key={lang} className="language-tag">
                            <span 
                              className="language-dot" 
                              style={{backgroundColor: getLanguageColor(lang)}}
                            ></span>
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="repo-links">
                    <a 
                      href={selectedRepo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="repo-link"
                    >
                      View on GitHub
                    </a>
                    {selectedRepo.homepage && (
                      <a 
                        href={selectedRepo.homepage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="repo-link"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Modal */}
        {userProfile && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal__header">
                <h3>{userProfile.name || userProfile.login}</h3>
                <button className="close-button" onClick={closeModal}>×</button>
              </div>
              
              <div className="modal__content">
                <div className="user-profile">
                  <img 
                    src={userProfile.avatar_url} 
                    alt={userProfile.login}
                    className="profile-avatar"
                  />
                  <div className="profile-info">
                    <h4>{userProfile.name || userProfile.login}</h4>
                    <p>@{userProfile.login}</p>
                    {userProfile.bio && <p className="profile-bio">{userProfile.bio}</p>}
                    {userProfile.location && <p>📍 {userProfile.location}</p>}
                    {userProfile.company && <p>🏢 {userProfile.company}</p>}
                  </div>
                </div>

                <div className="profile-stats">
                  <div className="profile-stat">
                    <span className="stat-value">{userProfile.public_repos}</span>
                    <span className="stat-label">Repositories</span>
                  </div>
                  <div className="profile-stat">
                    <span className="stat-value">{userProfile.followers}</span>
                    <span className="stat-label">Followers</span>
                  </div>
                  <div className="profile-stat">
                    <span className="stat-value">{userProfile.following}</span>
                    <span className="stat-label">Following</span>
                  </div>
                </div>

                {userProfile.repositories && userProfile.repositories.length > 0 && (
                  <div className="user-repos">
                    <h5>Popular Repositories</h5>
                    <div className="repo-list">
                      {userProfile.repositories.map((repo) => (
                        <div key={repo.id} className="repo-item">
                          <h6>{repo.name}</h6>
                          <p>{repo.description || 'No description'}</p>
                          <div className="repo-item-stats">
                            <span>⭐ {repo.stargazers_count}</span>
                            {repo.language && <span>{repo.language}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="profile-links">
                  <a 
                    href={userProfile.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="profile-link"
                  >
                    View on GitHub
                  </a>
                  {userProfile.blog && (
                    <a 
                      href={userProfile.blog} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="profile-link"
                    >
                      Visit Website
                    </a>
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

// Helper function to get language colors
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    PHP: '#4F5D95',
    Ruby: '#701516',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Vue: '#2c3e50',
    React: '#61dafb'
  }
  return colors[language] || '#586069'
}

export default GitHub
