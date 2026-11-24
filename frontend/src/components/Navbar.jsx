import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { navigation } from '../data/site'
import useScrollPosition from '../hooks/useScrollPosition'

export default function Navbar() {
  const scrolled = useScrollPosition()
  const [open, setOpen] = useState(false)
  const closeMenu = () => setOpen(false)
  return (
    <header className={`site-header${scrolled ? ' site-header--solid' : ''}`}>
      <div className="container site-header__inner">
        <Link className="brand" to="/" aria-label="The Lift Lab home" onClick={closeMenu}>
          <span className="brand__mark">LL</span><span className="brand__wordmark">THE LIFT<span>LAB</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'}>{item.label}</NavLink>)}
        </nav>
        <Link className="button button--primary header-cta" to="/contact">Join Now <ArrowUpRight size={16} /></Link>
        <button className="menu-toggle" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      <AnimatePresence>
        {open && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>
          {navigation.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={closeMenu}>{item.label}</NavLink>)}
          <Link className="button button--primary" to="/contact" onClick={closeMenu}>Join Now <ArrowUpRight size={16} /></Link>
        </motion.nav>}
      </AnimatePresence>
    </header>
  )
}
