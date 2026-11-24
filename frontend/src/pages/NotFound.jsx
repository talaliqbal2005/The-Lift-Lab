import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { pageCopy } from '../data/site'

export default function NotFound() {
  return <><PageIntro {...pageCopy.notFound} /><section className="section section--top"><div className="container not-found-action"><span>404</span><Link className="button button--primary" to="/"><ArrowLeft size={17} /> Back to home</Link></div></section></>
}
