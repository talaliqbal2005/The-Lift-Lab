import { ArrowRight, ArrowUpRight, Activity, Dumbbell, Sparkles, Target, UsersRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import EquipmentCard from '../components/EquipmentCard'
import FacilityCard from '../components/FacilityCard'
import Hero from '../components/Hero'
import PricingCard from '../components/PricingCard'
import SectionHeading from '../components/SectionHeading'
import TrainerCard from '../components/TrainerCard'
import { equipment } from '../data/equipment'
import { facilities } from '../data/facilities'
import { membershipTerms, plans } from '../data/plans'
import { benefits, firstVisitInfo, homeSections, pageCopy } from '../data/site'
import { trainers } from '../data/trainers'

const benefitIcons = { Activity, Dumbbell, Sparkles, Target, UsersRound }

export default function Home() {
  return (
    <>
      <Hero />
      <section className="section section--about" id="about">
        <div className="container">
          <SectionHeading {...pageCopy.about} />
          <div className="benefit-grid">
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[benefit.icon] || Sparkles
              return <motion.article className="benefit-card" key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -5 }}>
                <span className="benefit-card__icon"><Icon size={22} /></span><span className="benefit-card__number">0{index + 1}</span><h3>{benefit.title}</h3><p>{benefit.text}</p>
              </motion.article>
            })}
          </div>
        </div>
      </section>
      <section className="section section--soft">
        <div className="container">
          <div className="section-row"><SectionHeading {...homeSections.trainers} /><Link className="text-link" to="/trainers">Meet all coaches <ArrowUpRight size={17} /></Link></div>
          <div className="trainer-grid">{trainers.map((trainer, index) => <TrainerCard trainer={trainer} index={index} key={trainer.name} />)}</div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-row"><SectionHeading {...homeSections.facilities} /><Link className="text-link" to="/facilities">Explore the club <ArrowUpRight size={17} /></Link></div>
          <div className="facility-grid facility-grid--preview">{facilities.slice(0, 4).map((facility, index) => <FacilityCard facility={facility} index={index} key={facility.name} />)}</div>
        </div>
      </section>
      <section className="equipment-feature">
        <div className="container equipment-feature__layout">
          <div className="equipment-feature__copy"><SectionHeading {...homeSections.equipment} /><Button to="/equipment" variant="outline">Explore equipment <ArrowRight size={16} /></Button></div>
          <div className="equipment-feature__cards">{[equipment[3], equipment[6]].map((item, index) => <EquipmentCard item={item} index={index} key={item.name} />)}</div>
        </div>
      </section>
      <section className="section section--plans">
        <div className="container"><SectionHeading {...homeSections.plans} centered /><div className="pricing-grid">{plans.map((plan) => <PricingCard plan={plan} key={plan.name} />)}</div><div className="plans-note">{membershipTerms.map((term) => <p key={term}>{term}</p>)}</div></div>
      </section>
      <section className="section section--first-visit">
        <div className="container first-visit-layout">
          <SectionHeading {...homeSections.firstVisit} />
          <div className="first-visit-card"><strong>{firstVisitInfo.badge}</strong><p>{firstVisitInfo.details}</p><Button to="/contact">Plan your first visit <ArrowRight size={17} /></Button></div>
        </div>
      </section>
      <section className="final-cta">
        <div className="container final-cta__inner"><div><span className="eyebrow">{pageCopy.homeCta.eyebrow}</span><h2>{pageCopy.homeCta.title}</h2><p>{pageCopy.homeCta.description}</p></div><Button to="/contact">Claim your free trial <ArrowRight size={17} /></Button><span className="final-cta__index">LL / 01</span></div>
      </section>
    </>
  )
}
