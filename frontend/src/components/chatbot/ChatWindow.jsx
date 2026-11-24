import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, X } from 'lucide-react'
import { chatCopy } from '../../data/site'
import useChat from '../../hooks/useChat'
import MessageBubble from './MessageBubble'
import QuickReplies from './QuickReplies'
import TypingIndicator from './TypingIndicator'

export default function ChatWindow({ onClose }) {
  const { messages, isLoading, sendMessage } = useChat()
  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function submit(event) {
    event.preventDefault()
    if (!draft.trim() || isLoading) return
    const message = draft
    setDraft('')
    await sendMessage(message)
  }

  return (
    <motion.section className="chat-window" role="dialog" aria-modal="false" aria-labelledby="chat-title" initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ duration: 0.2 }}>
      <header className="chat-header"><span className="chat-header__avatar">LL</span><div><h2 id="chat-title">Lift Lab Assistant</h2><span><i /> Online and ready to help</span></div><button type="button" aria-label="Close chat" onClick={onClose}><X size={19} /></button></header>
      <div className="chat-messages" aria-live="polite">
        {messages.map((message, index) => <MessageBubble key={`${message.role}-${index}`} message={message} />)}
        <AnimatePresence>{isLoading && <TypingIndicator key="typing" />}</AnimatePresence>
        <div ref={bottomRef} />
      </div>
      {messages.length === 1 && <QuickReplies onSelect={sendMessage} disabled={isLoading} />}
      <form className="chat-input" onSubmit={submit}>
        <label className="sr-only" htmlFor="chat-message-input">Message the Lift Lab assistant</label>
        <input id="chat-message-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask us anything..." maxLength={1000} disabled={isLoading} />
        <button type="submit" aria-label="Send message" disabled={!draft.trim() || isLoading}><ArrowUp size={18} /></button>
      </form>
      <p className="chat-disclaimer">{chatCopy.disclaimer}</p>
    </motion.section>
  )
}
