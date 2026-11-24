import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { stats } from '../data/site'

function StatCounter({ value }) {
  const count = useMotionValue(0)
  const spring = useSpring(count, { duration: 1700 })
  const rounded = useTransform(spring, (latest) => Math.round(latest).toLocaleString())
  useEffect(() => { count.set(value) }, [count, value])
  return <motion.span>{rounded}</motion.span>
}

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-section__image" aria-hidden="true" />
      <motion.div className="hero-section__orb" aria-hidden="true" animate={{ y: [0, -18, 0], opacity: [0.35, 0.55, 0.35] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="container hero-section__content">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="hero-kicker"><span /> DHA PHASE 6 · KARACHI</span>
          <h1>Forge your<br /><span>strongest self.</span></h1>
          <p className="hero-copy">A premium, performance-focused gym for men and women. Build strength, improve fitness, and feel confident with expert coaching and dedicated training zones.</p>
          <div className="hero-actions"><Link className="button button--primary" to="/contact">Start your journey <ArrowRight size={17} /></Link><Link className="hero-link" to="/facilities">Explore the space <MoveUpRight size={16} /></Link></div>
        </motion.div>
        <motion.div className="hero-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}>
          {stats.map((stat) => <div className="hero-stat" key={stat.label}><strong><StatCounter value={stat.value} />{stat.suffix}</strong><span>{stat.label}</span></div>)}
        </motion.div>
      </div>
      <a className="hero-scroll" href="#about"><span>Scroll to discover</span><ArrowDown size={16} /></a>
      <span className="hero-side-note">KARACHI · PAKISTAN</span>
    </section>
  )
}
