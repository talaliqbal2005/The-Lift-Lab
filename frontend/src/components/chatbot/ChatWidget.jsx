import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import ChatWindow from './ChatWindow'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const closeOnEscape = (event) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])
  return (
    <div className="chat-widget">
      <AnimatePresence>{open && <ChatWindow key="chat-window" onClose={() => setOpen(false)} />}</AnimatePresence>
      <motion.button className={`chat-launcher${open ? ' chat-launcher--open' : ''}`} type="button" aria-label={open ? 'Close assistant' : 'Open Lift Lab assistant'} aria-expanded={open} onClick={() => setOpen(!open)} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
        <span className="chat-launcher__pulse" aria-hidden="true" />{open ? <X size={22} /> : <MessageCircle size={23} />}
      </motion.button>
    </div>
  )
}
