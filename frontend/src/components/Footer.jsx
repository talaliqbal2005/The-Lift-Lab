import { ArrowUpRight, Camera, CirclePlay, MapPin, Phone, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contactInfo, navigation } from '../data/site'

const socialIcons = { Instagram: Camera, Facebook: UsersRound, YouTube: CirclePlay }
const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-brand"><Link className="brand" to="/"><span className="brand__mark">LL</span><span className="brand__wordmark">THE LIFT<span>LAB</span></span></Link><p>Train with purpose.<br />Leave a little stronger.</p><div className="footer-socials">{contactInfo.socials.map((social) => { const Icon = socialIcons[social.label] || Instagram; return <a key={social.label} href={social.href} aria-label={social.label} target="_blank" rel="noreferrer"><Icon size={21} /></a> })}</div></div>
          <div className="footer-column"><h3>Explore</h3>{navigation.map((item) => <Link key={item.to} to={item.to}>{item.label}</Link>)}</div>
          <div className="footer-column footer-contact"><h3>Find us</h3><p><MapPin size={19} />{contactInfo.address}</p><a href={`tel:${contactInfo.phone.replace(/[^\d+]/g, '')}`}><Phone size={19} />{contactInfo.phone}</a><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}<ArrowUpRight size={17} /></a></div>
        </div>
        <div className="footer-bottom"><span>© {currentYear} The Lift Lab. All rights reserved.</span><span>Made for the work.</span></div>
      </div>
    </footer>
  )
}
