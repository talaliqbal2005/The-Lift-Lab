import { useEffect } from 'react'
import { AnimatePresence, MotionConfig } from 'framer-motion'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import ChatWidget from './components/chatbot/ChatWidget'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import PageTransition from './components/PageTransition'
import Contact from './pages/Contact'
import Equipment from './pages/Equipment'
import Facilities from './pages/Facilities'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Trainers from './pages/Trainers'

function RouteContent() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const titles = { '/': 'The Lift Lab | Forge your strongest self', '/trainers': 'Trainers | The Lift Lab', '/equipment': 'Equipment | The Lift Lab', '/facilities': 'Facilities | The Lift Lab', '/contact': 'Contact | The Lift Lab' }
    document.title = titles[location.pathname] || 'Page not found | The Lift Lab'
  }, [location.pathname])

  return <>
    <Navbar />
    <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/trainers" element={<PageTransition><Trainers /></PageTransition>} />
      <Route path="/equipment" element={<PageTransition><Equipment /></PageTransition>} />
      <Route path="/facilities" element={<PageTransition><Facilities /></PageTransition>} />
      <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
    </Routes></AnimatePresence>
    <Footer />
    <ChatWidget />
  </>
}

export default function App() {
  return <MotionConfig reducedMotion="user"><BrowserRouter><RouteContent /></BrowserRouter></MotionConfig>
}
