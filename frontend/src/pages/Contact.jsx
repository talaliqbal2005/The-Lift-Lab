import { useState } from 'react'
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import { contactFormLabels, contactInfo, pageCopy } from '../data/site'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`
  const phoneUrl = `tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`
  const submit = (event) => {
    event.preventDefault()
    setSent(true)
    event.currentTarget.reset()
  }
  return <>
    <PageIntro {...pageCopy.contact} />
    <section className="section section--top"><div className="container contact-layout">
      <form className="contact-form" onSubmit={submit}>
        <div className="contact-form__heading"><span className="eyebrow">Say hello</span><h2>Let’s get the conversation started.</h2><p>Tell us a little about what you are looking for and our team will be in touch.</p></div>
        <label>{contactFormLabels.name}<input name="name" type="text" autoComplete="name" placeholder="Your name" required minLength={2} /></label>
        <label>{contactFormLabels.email}<input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></label>
        <label>{contactFormLabels.phone}<input name="phone" type="tel" autoComplete="tel" placeholder={contactFormLabels.phonePlaceholder} pattern="[0-9+().\\-\\s]{7,20}" /></label>
        <label>{contactFormLabels.message}<textarea name="message" rows="5" placeholder="What would you like to know?" required minLength={10} /></label>
        <button className="button button--primary" type="submit">{contactFormLabels.submit}<ArrowUpRight size={17} /></button>
        {sent && <p className="form-success" role="status">{contactFormLabels.success}</p>}
      </form>
      <aside className="contact-aside">
        <div className="contact-details"><span className="eyebrow">Find your way here</span><h2>Visit the club</h2>
          <a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={19} /><span>{contactInfo.address}<small>Get directions <ArrowUpRight size={13} /></small></span></a>
          <a href={phoneUrl}><Phone size={19} /><span>{contactInfo.phone}<small>Call the front desk</small></span></a>
          <a href={contactInfo.whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /><span>WhatsApp<small>Message us at {contactInfo.phone}</small></span></a>
          <a href={`mailto:${contactInfo.email}`}><Mail size={19} /><span>{contactInfo.email}<small>{contactInfo.emailHint}</small></span></a>
        </div>
        <div className="map-placeholder" role="img" aria-label={contactFormLabels.mapLabel}><span className="map-grid" /><span className="map-pin"><MapPin size={22} /></span><span className="map-label">THE LIFT LAB<br /><small>{contactInfo.address}</small></span><a href={mapUrl} target="_blank" rel="noreferrer">Open in Maps <ArrowUpRight size={14} /></a></div>
        <div className="contact-hours"><h3><Clock3 size={17} /> Opening hours</h3>{contactInfo.hours.map((entry) => <p key={entry.days}><span>{entry.days}</span><span>{entry.hours}</span></p>)}<p><span>Women-only hours</span><span>{contactInfo.womenOnlyHours}</span></p><p><span>Peak hours</span><span>{contactInfo.peakHours}</span></p><p><span>Quietest hours</span><span>{contactInfo.quietHours}</span></p></div>
      </aside>
    </div></section>
  </>
}
