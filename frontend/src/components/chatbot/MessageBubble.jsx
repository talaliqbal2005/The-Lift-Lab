import { motion } from 'framer-motion'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <motion.div className={`chat-message${isUser ? ' chat-message--user' : ''}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      {!isUser && <span className="chat-message__avatar">LL</span>}
      <div className="chat-message__body">
        <p>{message.content}</p>
        {!isUser && message.sources?.length > 0 && <ul className="chat-sources">{message.sources.map((source, index) => <li key={`${source}-${index}`}>{source}</li>)}</ul>}
      </div>
    </motion.div>
  )
}
