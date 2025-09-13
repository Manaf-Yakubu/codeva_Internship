import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import quoteService from '../../services/quoteService'
import Card from '../common/Card'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import './Quotes.css'

const Quotes = () => {
  const { state, setLoading, setError, setData } = useAppContext()
  const [quoteOfTheDay, setQuoteOfTheDay] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('inspirational')

  const categories = [
    { value: 'inspirational', label: 'Inspirational', icon: '✨' },
    { value: 'motivational', label: 'Motivational', icon: '💪' },
    { value: 'wisdom', label: 'Wisdom', icon: '🧠' },
    { value: 'success', label: 'Success', icon: '🎯' },
    { value: 'african', label: 'African Wisdom', icon: '🌍' }
  ]

  useEffect(() => {
    fetchQuotes()
    fetchQuoteOfTheDay()
  }, [selectedCategory])

  const fetchQuotes = async () => {
    setLoading('quotes', true)
    setError('quotes', null)

    try {
      let result
      
      if (selectedCategory === 'african') {
        result = await quoteService.getAfricanQuotes()
      } else {
        result = await quoteService.getQuotesByTag(selectedCategory)
      }
      
      if (result.error) {
        setError('quotes', result.error.message)
        return
      }

      // Handle different response structures
      const quotes = result.data?.results || result.data || []
      setData('quotes', quotes.slice(0, 6)) // Show only first 6 quotes
    } catch (error) {
      setError('quotes', 'Failed to fetch quotes')
    } finally {
      setLoading('quotes', false)
    }
  }

  const fetchQuoteOfTheDay = async () => {
    try {
      const result = await quoteService.getQuoteOfTheDay()
      if (result.data && !result.error) {
        setQuoteOfTheDay(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch quote of the day:', error)
    }
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
  }

  const getRandomQuote = async () => {
    setLoading('quotes', true)
    try {
      const result = await quoteService.getRandomQuote()
      if (result.data && !result.error) {
        setQuoteOfTheDay(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch random quote:', error)
    } finally {
      setLoading('quotes', false)
    }
  }

  if (state.loading.quotes && !state.data.quotes?.length) {
    return (
      <section id="quotes" className="quotes">
        <div className="container">
          <div className="quotes__header">
            <h2 className="quotes__title">Inspirational Quotes</h2>
          </div>
          <div className="loading-container">
            <LoadingSpinner size="large" color="accent" text="Loading inspiring quotes..." />
          </div>
        </div>
      </section>
    )
  }

  if (state.errors.quotes && !state.data.quotes?.length) {
    return (
      <section id="quotes" className="quotes">
        <div className="container">
          <div className="quotes__header">
            <h2 className="quotes__title">Inspirational Quotes</h2>
          </div>
          <div className="error-container">
            <h3>Failed to Load Quotes</h3>
            <p>{state.errors.quotes}</p>
            <Button variant="accent" onClick={fetchQuotes}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const quotes = state.data.quotes || []

  return (
    <section id="quotes" className="quotes">
      <div className="container">
        <div className="quotes__header">
          <h2 className="quotes__title">Words of Wisdom</h2>
          <p className="quotes__subtitle">
            Discover inspiring quotes to motivate and uplift your spirit
          </p>
        </div>

        {quoteOfTheDay && (
          <div className="quote-of-the-day">
            <Card variant="ghana" className="qotd-card">
              <div className="qotd-content">
                <div className="qotd-header">
                  <h3>Quote of the Day</h3>
                  <Button variant="ghost" size="small" onClick={getRandomQuote}>
                    🎲 Random
                  </Button>
                </div>
                <blockquote className="qotd-quote">
                  "{quoteOfTheDay.content}"
                </blockquote>
                <cite className="qotd-author">— {quoteOfTheDay.author}</cite>
                {quoteOfTheDay.tags && (
                  <div className="qotd-tags">
                    {quoteOfTheDay.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="quote-tag">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        <div className="quotes__controls">
          <div className="category-selector">
            <h4>Choose Category:</h4>
            <div className="category-buttons">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'accent' : 'outline'}
                  size="small"
                  onClick={() => handleCategoryChange(category.value)}
                  className="category-button"
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="quotes__content">
          {quotes.length > 0 ? (
            <div className="quotes__grid">
              {quotes.map((quote, index) => (
                <Card 
                  key={quote._id || index}
                  variant="elevated"
                  hoverable
                  className="quote-card"
                >
                  <div className="quote-content">
                    <blockquote className="quote-text">
                      "{quote.content}"
                    </blockquote>
                    <div className="quote-footer">
                      <cite className="quote-author">— {quote.author}</cite>
                      {quote.tags && quote.tags.length > 0 && (
                        <div className="quote-tags">
                          {quote.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="quote-tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="no-quotes">
              <Card variant="outlined" className="no-quotes-card">
                <div className="no-quotes-content">
                  <h3>No quotes found</h3>
                  <p>Try selecting a different category or refresh the page.</p>
                  <Button variant="accent" onClick={fetchQuotes}>
                    Refresh Quotes
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="quotes__info">
          <Card variant="outlined" className="quotes-info-card">
            <div className="quotes-info-content">
              <h4>About Inspirational Quotes</h4>
              <p>
                Quotes have the power to inspire, motivate, and provide wisdom in our daily lives. 
                This collection features quotes from various categories, including African wisdom 
                that reflects the rich cultural heritage and philosophical traditions of the continent.
              </p>
              <div className="quote-stats">
                <div className="quote-stat">
                  <span className="stat-icon">📚</span>
                  <span>Curated Collection</span>
                </div>
                <div className="quote-stat">
                  <span className="stat-icon">🌍</span>
                  <span>Global Wisdom</span>
                </div>
                <div className="quote-stat">
                  <span className="stat-icon">💡</span>
                  <span>Daily Inspiration</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Quotes
