import { motion } from 'framer-motion'

export default function TypingIndicator() {
  return <div className="typing-indicator" role="status" aria-label="Assistant is typing"><span className="chat-message__avatar">LL</span><div className="typing-indicator__dots">{[0, 1, 2].map((dot) => <motion.i key={dot} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.55, repeat: Infinity, delay: dot * 0.12 }} />)}</div></div>
}
