import React from 'react'
import './Button.css'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClass = 'btn'
  const variantClass = `btn--${variant}`
  const sizeClass = `btn--${size}`
  const loadingClass = loading ? 'btn--loading' : ''
  const disabledClass = disabled ? 'btn--disabled' : ''
  
  const buttonClass = [
    baseClass,
    variantClass,
    sizeClass,
    loadingClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="btn__spinner"></span>}
      <span className={loading ? 'btn__text--hidden' : 'btn__text'}>
        {children}
      </span>
    </button>
  )
}

export default Button
