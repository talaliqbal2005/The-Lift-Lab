import { useState } from 'react'
import { chatCopy } from '../data/site'
import { sendChatMessage } from '../services/api'

export default function useChat() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: chatCopy.greeting, sources: [] }])
  const [isLoading, setIsLoading] = useState(false)

  async function sendMessage(rawMessage) {
    const message = rawMessage.trim()
    if (!message || isLoading) return

    const nextMessages = [...messages, { role: 'user', content: message }]
    setMessages(nextMessages)
    setIsLoading(true)
    try {
      const history = messages.filter((item) => item.role !== 'system').map(({ role, content }) => ({ role, content }))
      const response = await sendChatMessage(message, history)
      setMessages((current) => [...current, { role: 'assistant', content: response.reply, sources: response.sources }])
    } catch (error) {
      console.error('Unable to reach the Lift Lab assistant.', error)
      setMessages((current) => [...current, { role: 'assistant', content: chatCopy.unavailable, sources: [] }])
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, isLoading, sendMessage }
}
