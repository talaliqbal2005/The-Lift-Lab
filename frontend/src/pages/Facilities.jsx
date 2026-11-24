import FacilityCard from '../components/FacilityCard'
import PageIntro from '../components/PageIntro'
import { facilities } from '../data/facilities'
import { pageCopy } from '../data/site'

export default function Facilities() {
  return <><PageIntro {...pageCopy.facilities} /><section className="section section--top"><div className="container facility-grid">{facilities.map((facility, index) => <FacilityCard facility={facility} index={index} key={facility.name} />)}</div></section></>
}
