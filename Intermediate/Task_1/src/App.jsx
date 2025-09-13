import React from 'react'
import { AppProvider } from './context/AppContext'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Weather from './components/sections/Weather'
import Users from './components/sections/Users'
import Quotes from './components/sections/Quotes'
import GitHub from './components/sections/GitHub'
import Contact from './components/sections/Contact'
import './styles/App.css'

function App() {
  return (
    <AppProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Hero />
          <About />
          <Weather />
          <Users />
          <Quotes />
          <GitHub />
          <Contact />
        </main>
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App
