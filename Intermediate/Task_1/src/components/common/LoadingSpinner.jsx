import React from 'react'
import './LoadingSpinner.css'

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'primary',
  text = '',
  className = '',
  ...props 
}) => {
  const baseClass = 'spinner'
  const sizeClass = `spinner--${size}`
  const colorClass = `spinner--${color}`
  
  const spinnerClass = [
    baseClass,
    sizeClass,
    colorClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="spinner-container" {...props}>
      <div className={spinnerClass}>
        <div className="spinner__circle"></div>
        <div className="spinner__circle"></div>
        <div className="spinner__circle"></div>
        <div className="spinner__circle"></div>
      </div>
      {text && <p className="spinner__text">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
