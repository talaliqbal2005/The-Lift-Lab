import { chatCopy } from '../../data/site'

export default function QuickReplies({ onSelect, disabled }) {
  return <div className="quick-replies" aria-label="Suggested questions">{chatCopy.quickQuestions.map((question) => <button key={question} type="button" disabled={disabled} onClick={() => onSelect(question)}>{question}</button>)}</div>
}
