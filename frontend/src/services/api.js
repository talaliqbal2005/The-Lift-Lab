import axios from 'axios'
import { chatCopy } from '../data/site'

// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const baseURL = import.meta.env.VITE_API_URL || ''
export const USE_MOCK = false

function getMockReply(message) {
  const text = message.toLowerCase()
  if (text.includes('sauna') || text.includes('steam')) return text.includes('steam') && !text.includes('sauna') ? chatCopy.mockAnswers.steam : chatCopy.mockAnswers.sauna
  if (['trainer', 'coach', 'personal training', 'weight loss', 'muscle building'].some((term) => text.includes(term))) return chatCopy.mockAnswers.trainers
  if (['class', 'hiit', 'yoga', 'zumba', 'spinning', 'crossfit'].some((term) => text.includes(term)) || (text.includes('functional') && text.includes('schedule'))) return chatCopy.mockAnswers.classes
  if (['locker', 'towel'].some((term) => text.includes(term))) return chatCopy.mockAnswers.lockers
  if (['location', 'address', 'parking', 'phone', 'whatsapp', 'email', 'contact'].some((term) => text.includes(term))) return chatCopy.mockAnswers.contact
  if (['facilit', 'wifi', 'air conditioning', 'juice bar', 'protein bar'].some((term) => text.includes(term))) return chatCopy.mockAnswers.amenities
  if (['equipment', 'treadmill', 'dumbbell', 'machine', 'kettlebell', 'functional training'].some((term) => text.includes(term))) return chatCopy.mockAnswers.equipment
  if (['trial', 'first visit', 'first-time', 'cnic', 'student card', 'assessment'].some((term) => text.includes(term))) return chatCopy.mockAnswers.firstVisit
  if (['medical', 'health concern', 'pregnant', 'blood pressure', 'heart problem', 'feeling unwell'].some((term) => text.includes(term))) return chatCopy.mockAnswers.health
  if (['freeze', 'cancel', 'payment', 'refund', 'minimum age', 'policy', 'policies'].some((term) => text.includes(term))) return chatCopy.mockAnswers.policies
  if (['what should i bring', 'gym rules', 'dress code', 'sandals', 'vaping', 'smoking'].some((term) => text.includes(term))) return chatCopy.mockAnswers.rules
  if (['price', 'how much', 'cost', 'discount', 'joining fee'].some((term) => text.includes(term))) return chatCopy.mockAnswers.membership
  if (['include', 'features', 'basic', 'pro', 'elite'].some((term) => text.includes(term)) || text.includes('plan')) return chatCopy.mockAnswers.plans
  if (['hour', 'open', 'time', 'women-only', 'women only', 'ramadan', 'holiday', 'quiet', 'busy', 'crowd'].some((term) => text.includes(term))) return chatCopy.mockAnswers.hours
  if (text.includes('membership')) return chatCopy.mockAnswers.membership
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
