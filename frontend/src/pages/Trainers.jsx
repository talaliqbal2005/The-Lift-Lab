import PageIntro from '../components/PageIntro'
import TrainerCard from '../components/TrainerCard'
import { personalTrainingRates, trainers } from '../data/trainers'
import { pageCopy } from '../data/site'

export default function Trainers() {
  return <><PageIntro {...pageCopy.trainers} /><section className="section section--top"><div className="container"><div className="trainer-grid">{trainers.map((trainer, index) => <TrainerCard trainer={trainer} index={index} key={trainer.name} />)}</div><p className="trainer-rates">Personal training: PKR {personalTrainingRates.perSession.toLocaleString('en-US')} per session, or PKR {personalTrainingRates.tenSessionPack.toLocaleString('en-US')} for 10 sessions. Elite includes {personalTrainingRates.eliteSessionsPerMonth} sessions per month.</p></div></section></>
}
