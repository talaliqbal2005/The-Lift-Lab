import { motion } from 'framer-motion'

export default function EquipmentCard({ item, index = 0 }) {
  return (
    <motion.article
      className="equipment-card"
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
      whileHover={{ y: -5 }}
    >
      <div className="equipment-card__image"><img src={item.image} alt={item.name} loading="lazy" /><span>{item.category}</span></div>
      <div className="equipment-card__body"><h3>{item.name}</h3><p>{item.description}</p></div>
    </motion.article>
  )
}
