import PageIntro from '../components/PageIntro'
import TrainerCard from '../components/TrainerCard'
import { trainers } from '../data/trainers'
import { pageCopy } from '../data/site'

export default function Trainers() {
  return <><PageIntro {...pageCopy.trainers} /><section className="section section--top"><div className="container trainer-grid">{trainers.map((trainer, index) => <TrainerCard trainer={trainer} index={index} key={trainer.name} />)}</div></section></>
}
