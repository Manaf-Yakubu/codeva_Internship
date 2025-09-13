import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Card from '../common/Card'
import Button from '../common/Button'
import './Contact.css'

const Contact = () => {
  const { state } = useAppContext()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your message! I will get back to you soon.'
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to send message. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: '👨‍💻',
      label: 'Developer',
      value: state.user.name,
      description: 'CodeVa Intern'
    },
    {
      icon: '📧',
      label: 'Email',
      value: state.user.email,
      description: 'Feel free to reach out'
    },
    {
      icon: '🌍',
      label: 'Location',
      value: `${state.user.location} 🇬🇭`,
      description: 'West Africa'
    },
    {
      icon: '🏢',
      label: 'Company',
      value: state.user.company,
      description: 'Internship Program'
    }
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      icon: '🐙',
      url: '#',
      description: 'View my code repositories'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: '#',
      description: 'Professional network'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: '#',
      description: 'Follow for updates'
    },
    {
      name: 'Portfolio',
      icon: '🌐',
      url: '#',
      description: 'View my work'
    }
  ]

  const skills = [
    'React Development',
    'JavaScript ES6+',
    'Modern CSS',
    'API Integration',
    'Responsive Design',
    'Component Architecture',
    'State Management',
    'Frontend Optimization'
  ]

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact__header">
          <h2 className="contact__title">Get In Touch</h2>
          <p className="contact__subtitle">
            Let's connect! I'm always interested in discussing new opportunities, 
            collaborations, or just having a chat about web development.
          </p>
        </div>

        <div className="contact__content">
          <div className="contact__info">
            <Card variant="ghana" className="contact-info-card">
              <div className="contact-info-content">
                <h3>Contact Information</h3>
                <div className="contact-details">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="contact-detail">
                      <div className="contact-icon">{info.icon}</div>
                      <div className="contact-text">
                        <h4>{info.label}</h4>
                        <p className="contact-value">{info.value}</p>
                        <p className="contact-description">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card variant="outlined" className="skills-card">
              <h4>Technical Skills</h4>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </Card>

            <Card variant="outlined" className="social-card">
              <h4>Connect With Me</h4>
              <div className="social-links">
                {socialLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.url}
                    className="social-link"
                    title={link.description}
                  >
                    <span className="social-icon">{link.icon}</span>
                    <span className="social-name">{link.name}</span>
                  </a>
                ))}
              </div>
            </Card>
          </div>

          <div className="contact__form">
            <Card variant="elevated" className="contact-form-card">
              <h3>Send Me a Message</h3>
              
              {submitStatus && (
                <div className={`form-status ${submitStatus.type}`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select a subject</option>
                    <option value="collaboration">Collaboration Opportunity</option>
                    <option value="job">Job Opportunity</option>
                    <option value="project">Project Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="general">General Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Write your message here..."
                    className="form-textarea"
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        <div className="contact__footer">
          <Card variant="outlined" className="contact-footer-card">
            <div className="contact-footer-content">
              <h4>About This Project</h4>
              <p>
                This React frontend application was built as part of the CodeVa internship program, 
                demonstrating modern web development practices, component-based architecture, 
                and API integration. The project showcases skills in React, JavaScript, CSS, 
                and responsive design.
              </p>
              <div className="project-stats">
                <div className="project-stat">
                  <span className="stat-icon">⚛️</span>
                  <span>React 18</span>
                </div>
                <div className="project-stat">
                  <span className="stat-icon">🎨</span>
                  <span>Modern CSS</span>
                </div>
                <div className="project-stat">
                  <span className="stat-icon">📱</span>
                  <span>Responsive</span>
                </div>
                <div className="project-stat">
                  <span className="stat-icon">🌐</span>
                  <span>API Integration</span>
                </div>
              </div>
              <div className="contact-cta">
                <p>
                  <strong>Interested in working together?</strong><br/>
                  I'm always open to discussing new opportunities and projects.
                </p>
                <Button 
                  variant="accent" 
                  onClick={() => document.getElementById('name').focus()}
                >
                  Start a Conversation
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Contact
