export const navigation = [
  { label: 'Home', to: '/' },
  { label: 'Trainers', to: '/trainers' },
  { label: 'Equipment', to: '/equipment' },
  { label: 'Facilities', to: '/facilities' },
  { label: 'Contact', to: '/contact' },
]

export const stats = [
  { value: 2400, suffix: '+', label: 'members' },
  { value: 18, suffix: '', label: 'expert coaches' },
  { value: 120, suffix: '+', label: 'pieces of equipment' },
  { value: 12, suffix: '', label: 'years stronger' },
]

export const benefits = [
  { icon: 'Target', title: 'Training with intent', text: 'Every session has a purpose. Build a plan around your goals, your pace, and the life you want to lead.' },
  { icon: 'UsersRound', title: 'Coaches in your corner', text: 'Real guidance from people who know your name, notice your progress, and care about how you get there.' },
  { icon: 'Dumbbell', title: 'Built to perform', text: 'Thoughtfully selected equipment, generous training space, and room to focus on the work.' },
  { icon: 'Sparkles', title: 'A better kind of energy', text: 'A welcoming, judgment-free community where showing up is celebrated and progress is personal.' },
]

export const contactInfo = {
  address: '1450 Westlake Avenue, Seattle, WA 98109',
  phone: '(206) 555-0148',
  email: 'hello@theliftlab.com',
  hours: [
    { days: 'Monday – Friday', hours: '6:00 AM – 10:00 PM' },
    { days: 'Saturday', hours: '9:00 AM – 12:00 PM' },
    { days: 'Sunday', hours: '9:00 AM – 12:00 PM' },
  ],
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
}

export const homeSections = {
  trainers: { eyebrow: 'People who move you forward', title: 'Meet your crew', description: 'Good coaching changes everything. Meet the people who make every rep count.' },
  facilities: { eyebrow: 'Room to do more', title: 'Made for your kind of strong', description: 'Thoughtful spaces for focused training, deep recovery, and everything in between.' },
  equipment: { eyebrow: 'Tools for the work', title: 'A little more room to lift', description: 'The right equipment, kept ready for whatever you came in to do.' },
  plans: { eyebrow: 'Memberships', title: 'Your next chapter starts here', description: 'Simple options. No pressure. Just a place to get stronger on your terms.' },
  testimonials: { eyebrow: 'The Lift Lab community', title: 'Progress looks different on everyone', description: 'Real people, showing up for themselves and finding their rhythm.' },
}

export const pageCopy = {
  trainers: { eyebrow: 'Good people. Great coaching.', title: 'Meet your coaches', description: 'Our coaches bring experience, curiosity, and a real commitment to helping you move forward.' },
  equipment: { eyebrow: 'Tools for the work', title: 'Find your next gear', description: 'Explore a considered mix of equipment for strength, conditioning, and everything in between.' },
  facilities: { eyebrow: 'A place to do more', title: 'Space to feel your best', description: 'From focused training to a proper reset, every part of the club has a reason to be here.' },
  contact: { eyebrow: 'Your next chapter', title: 'Come see for yourself', description: 'Questions about getting started? We would love to show you around.' },
  notFound: { eyebrow: 'Off the map', title: 'This page missed a rep', description: 'The page you are looking for is not here. Let us get you back to the good stuff.' },
  about: { eyebrow: 'More than a gym', title: 'Strength is personal', description: 'We built The Lift Lab around a simple idea: getting stronger should feel good, wherever you are starting from.' },
  homeCta: { eyebrow: 'The first step is yours', title: 'Your space. Your pace. Your next chapter.', description: 'Come by for a tour, meet the crew, and see what training here could look like for you.' },
}

export const chatCopy = {
  greeting: 'Hey there! I’m your Lift Lab assistant. Ask me about memberships, opening hours, or what you can find around the gym.',
  unavailable: 'I’m having trouble connecting right now. Please try again in a moment, or reach us at hello@theliftlab.com.',
  disclaimer: 'For the latest details, please check with our front desk.',
  quickQuestions: ['Membership prices?', 'Opening hours?', 'Do you have a sauna?'],
  mockAnswers: {
    membership: 'Basic is $40/month and includes full gym access and a personal locker. Pro is $80/month and includes everything in Basic, a trainer consultation, parking, and sauna and steam access. Elite is $120/month and includes everything in Pro, a personal trainer, and free group classes.',
    hours: 'We’re open Monday–Friday from 6 AM–10 PM, Saturday and Sunday from 9 AM–12 PM.',
    sauna: 'Yes! We have a cedar-lined sauna and a steam bath. Sauna and steam access are included with Pro and Elite memberships.',
    default: 'I can help with membership options, opening hours, facilities, and getting started. What would you like to know?',
  },
}

export const contactFormLabels = {
  name: 'Your name',
  email: 'Email address',
  phone: 'Phone number (optional)',
  message: 'How can we help?',
  submit: 'Send your message',
  success: 'This demo form is validated, but messages are not sent yet. Please email hello@theliftlab.com.',
  mapLabel: 'The Lift Lab location map',
}
