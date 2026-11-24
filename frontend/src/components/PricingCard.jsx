import { Check } from 'lucide-react'
import Button from './Button'

export default function PricingCard({ plan }) {
  return (
    <article className={`pricing-card${plan.featured ? ' pricing-card--featured' : ''}`}>
      {plan.featured && <span className="pricing-card__badge">Most popular</span>}
      <span className="pricing-card__name">{plan.name}</span>
      <div className="pricing-card__price"><strong>${plan.price}</strong><span>/ month</span></div>
      <p>{plan.description}</p>
      <ul>{plan.features.map((feature) => <li key={feature}><Check size={16} aria-hidden="true" />{feature}</li>)}</ul>
      <Button to="/contact" variant={plan.featured ? 'dark' : 'outline'} className="pricing-card__button">Choose {plan.name}</Button>
    </article>
  )
}
