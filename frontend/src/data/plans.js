export const plans = [
  {
    name: 'Basic',
    currency: 'PKR',
    price: 8000,
    description: 'Gym-floor access, locker rooms, and a fitness assessment to get started.',
    features: [
      'Gym floor, cardio & weight zones',
      'Locker room access',
      'Free joining fitness assessment',
      'Access during regular opening hours',
      'Sauna, steam & classes available for a fee',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    currency: 'PKR',
    price: 12000,
    description: 'Add group classes, monthly programming, and recovery access.',
    features: [
      'Everything in Basic',
      'Unlimited group classes',
      'Sauna & steam: up to 3 sessions per week',
      'Personalized monthly workout plan',
      'Free towel service',
    ],
    featured: true,
  },
  {
    name: 'Elite',
    currency: 'PKR',
    price: 20000,
    description: 'The complete plan, with personal training and priority access.',
    features: [
      'Everything in Pro',
      'Unlimited sauna & steam',
      '4 personal training sessions per month with a trainer of your choice',
      'Personalized diet & nutrition plan',
      'Priority booking for classes & personal training',
      '1 free guest pass per month',
      'Free personal locker rental',
      'Free protein shaker when joining',
    ],
    featured: false,
  },
]

export const membershipTerms = [
  'One-time joining fee: PKR 3,000; waived for 6- and 12-month memberships.',
  'Discounts: 5% for 3 months, 10% for 6 months, 20% for 12 months, 10% for students with valid ID, and 15% off the second member in a couple or family sign-up.',
  'Memberships are paid in advance. Payment methods: cash, debit or credit card, bank transfer, JazzCash, and Easypaisa.',
  'Plans of 3 months or longer can be frozen for up to 30 days per year with 7 days’ notice. Monthly memberships can be cancelled with 7 days’ notice; paid fees are non-refundable.',
]
