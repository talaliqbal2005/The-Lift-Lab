import { motion } from 'framer-motion'
import { Activity, CarFront, CupSoda, Dumbbell, Flame, LockKeyhole, Snowflake, UserRound, UsersRound, Waves, Wifi } from 'lucide-react'

const icons = { Activity, CarFront, CupSoda, Dumbbell, Flame, LockKeyhole, Snowflake, UserRound, UsersRound, Waves, Wifi }

export default function FacilityCard({ facility, index = 0 }) {
  const Icon = icons[facility.icon] || Activity
  return (
    <motion.article
      className={`facility-card${facility.featured ? ' facility-card--featured' : ''}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -5 }}
    >
      <span className="facility-card__icon"><Icon size={22} strokeWidth={1.7} /></span>
      <div><h3>{facility.name}</h3><p>{facility.description}</p></div>
      <ul>{facility.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
    </motion.article>
  )
}
