import React, { createContext, useContext, useReducer } from 'react'

// Initial state
const initialState = {
  user: {
    name: 'Yakubu Abdul Manaf',
    email: 'Yakubumanaf732hub@gmail.com',
    location: 'Ghana',
    company: 'CodeVa'
  },
  theme: 'light',
  loading: {
    weather: false,
    users: false,
    quotes: false,
    github: false
  },
  errors: {
    weather: null,
    users: null,
    quotes: null,
    github: null
  },
  data: {
    weather: null,
    users: [],
    quotes: [],
    github: null
  }
}

// Action types
export const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_DATA: 'SET_DATA',
  CLEAR_ERROR: 'CLEAR_ERROR',
  TOGGLE_THEME: 'TOGGLE_THEME'
}

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      }
    
    case actionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error
        },
        loading: {
          ...state.loading,
          [action.payload.key]: false
        }
      }
    
    case actionTypes.SET_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.key]: action.payload.data
        },
        loading: {
          ...state.loading,
          [action.payload.key]: false
        },
        errors: {
          ...state.errors,
          [action.payload.key]: null
        }
      }
    
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: null
        }
      }
    
    case actionTypes.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      }
    
    default:
      return state
  }
}

// Create context
const AppContext = createContext()

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const value = {
    state,
    dispatch,
    // Helper functions
    setLoading: (key, value) => dispatch({ 
      type: actionTypes.SET_LOADING, 
      payload: { key, value } 
    }),
    setError: (key, error) => dispatch({ 
      type: actionTypes.SET_ERROR, 
      payload: { key, error } 
    }),
    setData: (key, data) => dispatch({ 
      type: actionTypes.SET_DATA, 
      payload: { key, data } 
    }),
    clearError: (key) => dispatch({ 
      type: actionTypes.CLEAR_ERROR, 
      payload: { key } 
    }),
    toggleTheme: () => dispatch({ type: actionTypes.TOGGLE_THEME })
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}
