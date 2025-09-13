import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import weatherService from '../../services/weatherService'
import Card from '../common/Card'
import Button from '../common/Button'
import LoadingSpinner from '../common/LoadingSpinner'
import './Weather.css'

const Weather = () => {
  const { state, setLoading, setError, setData } = useAppContext()
  const [selectedCity, setSelectedCity] = useState('Accra')
  const [forecast, setForecast] = useState([])

  const ghanaCities = Object.keys(weatherService.ghanaCities)

  useEffect(() => {
    fetchWeatherData()
  }, [selectedCity])

  const fetchWeatherData = async () => {
    setLoading('weather', true)
    setError('weather', null)

    try {
      const [weatherResult, forecastResult] = await Promise.all([
        weatherService.getCurrentWeather(selectedCity),
        weatherService.getForecast(selectedCity)
      ])

      if (weatherResult.error) {
        setError('weather', weatherResult.error.message)
        return
      }

      setData('weather', weatherResult.data)
      setForecast(forecastResult.data?.list || [])
    } catch (error) {
      setError('weather', 'Failed to fetch weather data')
    } finally {
      setLoading('weather', false)
    }
  }

  const handleCityChange = (city) => {
    setSelectedCity(city)
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  if (state.loading.weather) {
    return (
      <section id="weather" className="weather">
        <div className="container">
          <div className="weather__header">
            <h2 className="weather__title">Weather in Ghana</h2>
          </div>
          <div className="loading-container">
            <LoadingSpinner size="large" color="ghana" text="Fetching weather data..." />
          </div>
        </div>
      </section>
    )
  }

  if (state.errors.weather) {
    return (
      <section id="weather" className="weather">
        <div className="container">
          <div className="weather__header">
            <h2 className="weather__title">Weather in Ghana</h2>
          </div>
          <div className="error-container">
            <h3>Weather Service Unavailable</h3>
            <p>{state.errors.weather}</p>
            <Button variant="primary" onClick={fetchWeatherData}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  const weatherData = state.data.weather

  return (
    <section id="weather" className="weather">
      <div className="container">
        <div className="weather__header">
          <h2 className="weather__title">Weather in Ghana 🇬🇭</h2>
          <p className="weather__subtitle">
            Current weather conditions across major Ghanaian cities
          </p>
        </div>

        <div className="weather__controls">
          <div className="city-selector">
            <label htmlFor="city-select">Select City:</label>
            <select 
              id="city-select"
              value={selectedCity} 
              onChange={(e) => handleCityChange(e.target.value)}
              className="city-select"
            >
              {ghanaCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" onClick={fetchWeatherData}>
            Refresh Weather
          </Button>
        </div>

        {weatherData && (
          <div className="weather__content">
            <Card variant="ghana" className="weather__current">
              <div className="current-weather">
                <div className="current-weather__main">
                  <div className="current-weather__location">
                    <h3>{weatherData.name}, {weatherData.sys?.country}</h3>
                    <p className="weather-description">
                      {weatherData.weather?.[0]?.description}
                    </p>
                  </div>
                  <div className="current-weather__temp">
                    <span className="temp-value">{Math.round(weatherData.main?.temp)}°</span>
                    <span className="temp-unit">C</span>
                  </div>
                </div>

                <div className="current-weather__details">
                  <div className="weather-detail">
                    <span className="detail-label">Feels like</span>
                    <span className="detail-value">{Math.round(weatherData.main?.feels_like)}°C</span>
                  </div>
                  <div className="weather-detail">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{weatherData.main?.humidity}%</span>
                  </div>
                  <div className="weather-detail">
                    <span className="detail-label">Pressure</span>
                    <span className="detail-value">{weatherData.main?.pressure} hPa</span>
                  </div>
                  <div className="weather-detail">
                    <span className="detail-label">Wind Speed</span>
                    <span className="detail-value">{weatherData.wind?.speed} m/s</span>
                  </div>
                </div>

                {weatherData.sys && (
                  <div className="current-weather__sun">
                    <div className="sun-time">
                      <span className="sun-label">🌅 Sunrise</span>
                      <span className="sun-value">{formatTime(weatherData.sys.sunrise)}</span>
                    </div>
                    <div className="sun-time">
                      <span className="sun-label">🌇 Sunset</span>
                      <span className="sun-value">{formatTime(weatherData.sys.sunset)}</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {forecast.length > 0 && (
              <div className="weather__forecast">
                <h3 className="forecast-title">3-Day Forecast</h3>
                <div className="forecast-grid">
                  {forecast.slice(0, 3).map((item, index) => (
                    <Card key={index} variant="outlined" className="forecast-card">
                      <div className="forecast-item">
                        <div className="forecast-date">
                          {formatDate(item.dt_txt)}
                        </div>
                        <div className="forecast-weather">
                          <span className="forecast-icon">
                            {item.weather?.[0]?.main === 'Rain' ? '🌧️' : 
                             item.weather?.[0]?.main === 'Clouds' ? '☁️' : 
                             item.weather?.[0]?.main === 'Clear' ? '☀️' : '🌤️'}
                          </span>
                          <span className="forecast-desc">
                            {item.weather?.[0]?.description}
                          </span>
                        </div>
                        <div className="forecast-temp">
                          <span className="temp-high">{Math.round(item.main?.temp)}°</span>
                          <span className="temp-humidity">💧 {item.main?.humidity}%</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            <div className="weather__info">
              <Card variant="outlined" className="weather-info-card">
                <h4>About Ghana's Climate</h4>
                <p>
                  Ghana has a tropical climate with two main seasons: the wet season 
                  (May to October) and the dry season (November to April). The country 
                  experiences warm temperatures year-round, with coastal areas being 
                  more humid than the northern regions.
                </p>
                <div className="climate-facts">
                  <div className="climate-fact">
                    <strong>Average Temperature:</strong> 26-29°C
                  </div>
                  <div className="climate-fact">
                    <strong>Rainy Season:</strong> May - October
                  </div>
                  <div className="climate-fact">
                    <strong>Dry Season:</strong> November - April
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Weather
