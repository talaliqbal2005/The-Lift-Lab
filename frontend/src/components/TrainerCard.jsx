import { motion } from 'framer-motion'

export default function TrainerCard({ trainer, index = 0 }) {
  return (
    <motion.article
      className="trainer-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      whileHover={{ y: -7 }}
    >
      <div className="trainer-card__image">
        <img src={trainer.image} alt={`${trainer.name}, ${trainer.role}`} loading="lazy" />
      </div>
      <div className="trainer-card__body">
        <div className="trainer-card__meta"><span>{trainer.role}</span><span>{trainer.experience}</span></div>
        <h3>{trainer.name}</h3>
        <p>{trainer.bio}</p>
        {trainer.certifications && <div className="tag-list">{trainer.certifications.map((cert) => <span className="tag" key={cert}>{cert}</span>)}</div>}
      </div>
    </motion.article>
  )
}
