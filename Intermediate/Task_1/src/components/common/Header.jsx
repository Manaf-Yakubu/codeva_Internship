import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Button from './Button'
import './Header.css'

const Header = () => {
  const { state, toggleTheme } = useAppContext()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="header ghana-stripes">
      <div className="container">
        <div className="header__content">
          <div className="header__brand">
            <h1 className="header__title">
              <span className="text-ghana-red">Code</span>
              <span className="text-ghana-gold">Va</span>
              <span className="text-ghana-green">Frontend</span>
            </h1>
            <p className="header__subtitle">by {state.user.name}</p>
          </div>

          <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
            <ul className="header__nav-list">
              <li><button onClick={() => scrollToSection('hero')} className="header__nav-link">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="header__nav-link">About</button></li>
              <li><button onClick={() => scrollToSection('weather')} className="header__nav-link">Weather</button></li>
              <li><button onClick={() => scrollToSection('users')} className="header__nav-link">Users</button></li>
              <li><button onClick={() => scrollToSection('quotes')} className="header__nav-link">Quotes</button></li>
              <li><button onClick={() => scrollToSection('github')} className="header__nav-link">GitHub</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="header__nav-link">Contact</button></li>
            </ul>
          </nav>

          <div className="header__actions">
            <Button
              variant="ghost"
              size="small"
              onClick={toggleTheme}
              className="header__theme-toggle"
              aria-label="Toggle theme"
            >
              {state.theme === 'light' ? '🌙' : '☀️'}
            </Button>
            
            <button
              className="header__menu-toggle"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span className={`hamburger ${isMenuOpen ? 'hamburger--active' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
