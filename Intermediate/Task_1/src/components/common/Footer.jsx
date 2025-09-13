import React from 'react'
import { useAppContext } from '../../context/AppContext'
import './Footer.css'

const Footer = () => {
  const { state } = useAppContext()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer ghana-stripes">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">CodeVa Frontend</h3>
            <p className="footer__description">
              A modern React application showcasing component-based development, 
              API integration, and responsive design principles.
            </p>
            <div className="footer__badges">
              <span className="badge badge--react">React 18</span>
              <span className="badge badge--vite">Vite</span>
              <span className="badge badge--css">Modern CSS</span>
            </div>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Developer</h4>
            <div className="footer__developer">
              <p><strong>{state.user.name}</strong></p>
              <p>CodeVa Intern from {state.user.location} 🇬🇭</p>
              <p>
                <a href={`mailto:${state.user.email}`} className="footer__link">
                  {state.user.email}
                </a>
              </p>
            </div>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Technologies</h4>
            <ul className="footer__tech-list">
              <li>React with Hooks</li>
              <li>Context API</li>
              <li>Axios for API calls</li>
              <li>CSS Modules</li>
              <li>Responsive Design</li>
              <li>Modern ES6+</li>
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">APIs Integrated</h4>
            <ul className="footer__api-list">
              <li>OpenWeatherMap</li>
              <li>JSONPlaceholder</li>
              <li>Quotable API</li>
              <li>GitHub REST API</li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>
              © {currentYear} {state.user.name}. Built for CodeVa Internship Program.
            </p>
          </div>
          <div className="footer__ghana">
            <span className="ghana-flag">🇬🇭</span>
            <span>Made with ❤️ in Ghana</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
