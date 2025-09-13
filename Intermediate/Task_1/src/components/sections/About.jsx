import React from 'react'
import { useAppContext } from '../../context/AppContext'
import Card from '../common/Card'
import './About.css'

const About = () => {
  const { state } = useAppContext()

  const technologies = [
    {
      name: 'React 18',
      description: 'Modern React with hooks and functional components',
      icon: '⚛️',
      color: 'primary'
    },
    {
      name: 'Context API',
      description: 'Global state management without external libraries',
      icon: '🔄',
      color: 'secondary'
    },
    {
      name: 'Vite',
      description: 'Fast build tool and development server',
      icon: '⚡',
      color: 'accent'
    },
    {
      name: 'Modern CSS',
      description: 'CSS custom properties, Grid, and Flexbox',
      icon: '🎨',
      color: 'primary'
    },
    {
      name: 'API Integration',
      description: 'RESTful API calls with error handling',
      icon: '🌐',
      color: 'secondary'
    },
    {
      name: 'Responsive Design',
      description: 'Mobile-first approach with modern layouts',
      icon: '📱',
      color: 'accent'
    }
  ]

  const features = [
    {
      title: 'Component-Based Architecture',
      description: 'Reusable UI components with props and composition patterns',
      benefits: ['Maintainable code', 'Consistent UI', 'Easy testing']
    },
    {
      title: 'State Management',
      description: 'React hooks and Context API for efficient state handling',
      benefits: ['Global state', 'No prop drilling', 'Performance optimized']
    },
    {
      title: 'API Integration',
      description: 'Multiple external APIs with loading states and error handling',
      benefits: ['Real-time data', 'Error boundaries', 'User feedback']
    },
    {
      title: 'Modern Development',
      description: 'Latest React patterns and modern JavaScript features',
      benefits: ['ES6+ syntax', 'Async/await', 'Modern tooling']
    }
  ]

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about__header">
          <h2 className="about__title">About This Project</h2>
          <p className="about__subtitle">
            A comprehensive React frontend showcasing modern development practices, 
            built as part of the CodeVa internship program by {state.user.name} from Ghana.
          </p>
        </div>

        <div className="about__content">
          <div className="about__intro">
            <Card variant="ghana" className="about__intro-card">
              <div className="about__intro-content">
                <h3>CodeVa Internship - Intermediate Level</h3>
                <p>
                  This project represents a significant step up from vanilla JavaScript to 
                  modern React development. It demonstrates component-based architecture, 
                  state management, and professional development practices.
                </p>
                <div className="about__metrics">
                  <div className="metric">
                    <span className="metric__number">10+</span>
                    <span className="metric__label">Components</span>
                  </div>
                  <div className="metric">
                    <span className="metric__number">4</span>
                    <span className="metric__label">API Services</span>
                  </div>
                  <div className="metric">
                    <span className="metric__number">100%</span>
                    <span className="metric__label">Responsive</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="about__technologies">
            <h3 className="about__section-title">Technologies Used</h3>
            <div className="tech-grid">
              {technologies.map((tech, index) => (
                <Card 
                  key={index}
                  variant="elevated"
                  hoverable
                  className={`tech-card tech-card--${tech.color}`}
                >
                  <div className="tech-card__content">
                    <div className="tech-card__icon">{tech.icon}</div>
                    <h4 className="tech-card__name">{tech.name}</h4>
                    <p className="tech-card__description">{tech.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="about__features">
            <h3 className="about__section-title">Key Features</h3>
            <div className="features-grid">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  title={feature.title}
                  variant="outlined"
                  hoverable
                  className="feature-card"
                >
                  <p className="feature-description">{feature.description}</p>
                  <ul className="feature-benefits">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex}>{benefit}</li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          <div className="about__developer">
            <Card variant="ghana" className="developer-card">
              <div className="developer-info">
                <div className="developer-avatar">
                  <span className="avatar-text">{state.user.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="developer-details">
                  <h4>About the Developer</h4>
                  <p><strong>{state.user.name}</strong></p>
                  <p>CodeVa Intern from {state.user.location} 🇬🇭</p>
                  <p>
                    Passionate about modern web development and creating 
                    user-friendly applications with clean, maintainable code.
                  </p>
                  <div className="developer-skills">
                    <span className="skill-tag">React</span>
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">CSS</span>
                    <span className="skill-tag">API Integration</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
