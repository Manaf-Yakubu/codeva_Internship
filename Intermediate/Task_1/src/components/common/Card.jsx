import React from 'react'
import './Card.css'

const Card = ({ 
  children, 
  title, 
  subtitle,
  image,
  imageAlt,
  variant = 'default',
  className = '',
  onClick,
  hoverable = false,
  ...props 
}) => {
  const baseClass = 'card'
  const variantClass = `card--${variant}`
  const hoverableClass = hoverable ? 'card--hoverable' : ''
  const clickableClass = onClick ? 'card--clickable' : ''
  
  const cardClass = [
    baseClass,
    variantClass,
    hoverableClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClass}
      onClick={onClick}
      {...props}
    >
      {image && (
        <div className="card__image">
          <img src={image} alt={imageAlt || title || 'Card image'} />
        </div>
      )}
      
      <div className="card__content">
        {title && (
          <div className="card__header">
            <h3 className="card__title">{title}</h3>
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
        )}
        
        <div className="card__body">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Card
