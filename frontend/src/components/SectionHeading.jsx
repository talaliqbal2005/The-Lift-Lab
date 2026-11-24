import { motion } from 'framer-motion'

export default function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <motion.div
      className={`section-heading${centered ? ' section-heading--center' : ''}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </motion.div>
  )
}
