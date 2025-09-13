import React from 'react'
import { useAppContext } from '../../context/AppContext'
import Button from '../common/Button'
import './Hero.css'

const Hero = () => {
  const { state } = useAppContext()

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero__content">
          <div className="hero__text">
            <h1 className="hero__title animate-fade-in">
              Welcome to My <span className="text-ghana-red">React</span> Frontend
            </h1>
            <p className="hero__subtitle animate-fade-in">
              A modern component-based application built with React, showcasing 
              API integration, state management, and responsive design principles.
            </p>
            <div className="hero__details animate-fade-in">
              <p className="hero__author">
                Built by <strong>{state.user.name}</strong> from {state.user.location} 🇬🇭
              </p>
              <p className="hero__context">
                CodeVa Internship - Intermediate Level Task 1
              </p>
            </div>
            <div className="hero__actions animate-fade-in">
              <Button 
                variant="primary" 
                size="large"
                onClick={() => scrollToSection('about')}
              >
                Explore Features
              </Button>
              <Button 
                variant="outline" 
                size="large"
                onClick={() => scrollToSection('contact')}
              >
                Get in Touch
              </Button>
            </div>
          </div>
          
          <div className="hero__visual">
            <div className="hero__card">
              <div className="hero__card-header ghana-stripes">
                <h3>React Frontend Showcase</h3>
              </div>
              <div className="hero__card-body">
                <div className="hero__features">
                  <div className="hero__feature">
                    <span className="hero__feature-icon">⚛️</span>
                    <span>React 18 + Hooks</span>
                  </div>
                  <div className="hero__feature">
                    <span className="hero__feature-icon">🎨</span>
                    <span>Modern CSS</span>
                  </div>
                  <div className="hero__feature">
                    <span className="hero__feature-icon">🌐</span>
                    <span>API Integration</span>
                  </div>
                  <div className="hero__feature">
                    <span className="hero__feature-icon">📱</span>
                    <span>Responsive Design</span>
                  </div>
                </div>
                <div className="hero__stats">
                  <div className="hero__stat">
                    <span className="hero__stat-number">4</span>
                    <span className="hero__stat-label">APIs</span>
                  </div>
                  <div className="hero__stat">
                    <span className="hero__stat-number">10+</span>
                    <span className="hero__stat-label">Components</span>
                  </div>
                  <div className="hero__stat">
                    <span className="hero__stat-number">100%</span>
                    <span className="hero__stat-label">Responsive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero__scroll-indicator">
          <div className="scroll-arrow" onClick={() => scrollToSection('about')}>
            <span>↓</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
