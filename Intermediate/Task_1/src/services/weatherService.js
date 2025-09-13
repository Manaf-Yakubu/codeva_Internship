import { apiCall, API_ENDPOINTS, API_KEYS } from './api'

// Weather service for OpenWeatherMap API
export const weatherService = {
  // Get current weather by city name
  getCurrentWeather: async (city = 'Accra') => {
    const url = `${API_ENDPOINTS.WEATHER}/weather`
    const params = {
      q: city,
      appid: API_KEYS.WEATHER,
      units: 'metric'
    }
    
    // For demo purposes, return mock data since we don't have a real API key
    if (API_KEYS.WEATHER === 'demo_key') {
      return {
        data: {
          name: city,
          main: {
            temp: 28,
            feels_like: 31,
            humidity: 75,
            pressure: 1013
          },
          weather: [
            {
              main: 'Partly Cloudy',
              description: 'partly cloudy',
              icon: '02d'
            }
          ],
          wind: {
            speed: 3.5
          },
          sys: {
            country: 'GH',
            sunrise: 1694587200,
            sunset: 1694630400
          }
        },
        error: null
      }
    }
    
    return await apiCall(url, { params })
  },

  // Get weather forecast
  getForecast: async (city = 'Accra') => {
    const url = `${API_ENDPOINTS.WEATHER}/forecast`
    const params = {
      q: city,
      appid: API_KEYS.WEATHER,
      units: 'metric',
      cnt: 5 // 5 day forecast
    }
    
    // Mock data for demo
    if (API_KEYS.WEATHER === 'demo_key') {
      return {
        data: {
          city: { name: city, country: 'GH' },
          list: [
            {
              dt: Date.now() / 1000,
              main: { temp: 29, humidity: 70 },
              weather: [{ main: 'Sunny', description: 'clear sky', icon: '01d' }],
              dt_txt: new Date().toISOString()
            },
            {
              dt: Date.now() / 1000 + 86400,
              main: { temp: 27, humidity: 80 },
              weather: [{ main: 'Cloudy', description: 'few clouds', icon: '02d' }],
              dt_txt: new Date(Date.now() + 86400000).toISOString()
            },
            {
              dt: Date.now() / 1000 + 172800,
              main: { temp: 26, humidity: 85 },
              weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
              dt_txt: new Date(Date.now() + 172800000).toISOString()
            }
          ]
        },
        error: null
      }
    }
    
    return await apiCall(url, { params })
  },

  // Get weather by coordinates (for Ghana's major cities)
  getWeatherByCoords: async (lat, lon) => {
    const url = `${API_ENDPOINTS.WEATHER}/weather`
    const params = {
      lat,
      lon,
      appid: API_KEYS.WEATHER,
      units: 'metric'
    }
    
    return await apiCall(url, { params })
  },

  // Ghana cities coordinates
  ghanaCities: {
    'Accra': { lat: 5.6037, lon: -0.1870 },
    'Kumasi': { lat: 6.6885, lon: -1.6244 },
    'Tamale': { lat: 9.4034, lon: -0.8424 },
    'Cape Coast': { lat: 5.1053, lon: -1.2466 },
    'Sekondi-Takoradi': { lat: 4.9344, lon: -1.7133 }
  }
}

export default weatherService
