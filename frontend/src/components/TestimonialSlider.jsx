import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { testimonials } from '../data/testimonials'

export default function TestimonialSlider() {
  const [active, setActive] = useState(0)
  const change = (step) => setActive((current) => (current + step + testimonials.length) % testimonials.length)
  const testimonial = testimonials[active]
  return (
    <div className="testimonial-slider">
      <div className="testimonial-slider__controls">
        <span>{String(active + 1).padStart(2, '0')} <i>/</i> {String(testimonials.length).padStart(2, '0')}</span>
        <div><button type="button" aria-label="Previous testimonial" onClick={() => change(-1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next testimonial" onClick={() => change(1)}><ArrowRight size={18} /></button></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.blockquote key={active} className="testimonial-quote" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={{ duration: 0.25 }}>
          <Quote className="testimonial-quote__icon" size={30} />
          <p>“{testimonial.quote}”</p>
          <footer><span className="testimonial-avatar">{testimonial.initials}</span><span><strong>{testimonial.name}</strong><small>{testimonial.detail}</small></span></footer>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  )
}
