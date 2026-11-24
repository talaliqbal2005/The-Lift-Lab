import axios from 'axios'
import { chatCopy } from '../data/site'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const USE_MOCK = true

function getMockReply(message) {
  const text = message.toLowerCase()
  if (text.includes('price') || text.includes('membership') || text.includes('plan')) return chatCopy.mockAnswers.membership
  if (text.includes('hour') || text.includes('open') || text.includes('time')) return chatCopy.mockAnswers.hours
  if (text.includes('sauna') || text.includes('steam')) return chatCopy.mockAnswers.sauna
  return chatCopy.mockAnswers.default
}

export async function sendChatMessage(message, history) {
  if (USE_MOCK) {
    await new Promise((resolve) => window.setTimeout(resolve, 1000))
    return { reply: getMockReply(message), sources: [] }
  }

  const { data } = await axios.post(`${baseURL}/api/chat`, { message, history }, { timeout: 20000 })
  if (typeof data?.reply !== 'string') throw new Error('The assistant returned an unexpected response.')
  return { reply: data.reply, sources: Array.isArray(data.sources) ? data.sources : [] }
}
