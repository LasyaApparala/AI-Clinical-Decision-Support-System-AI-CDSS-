import User from '../models/User.js'
import Stripe from 'stripe'
const stripeKey = process.env.STRIPE_SECRET_KEY
const stripe = stripeKey ? new Stripe(stripeKey) : null

export async function status(req, res) {
  const user = await User.findById(req.user.id)
  res.json({ tier: user.subscription?.tier || 'free', validUntil: user.subscription?.validUntil || null })
}

export async function upgrade(req, res) {
  if (!stripe) return res.status(400).json({ error: 'Stripe not configured' })
  // Create Checkout Session or Billing Portal (implementation depends on your product setup)
  res.json({ url: 'https://billing.example/checkout' })
}

export async function createCheckoutSession(req, res) {
  try {
    const { plan } = req.body
    
    // This is a placeholder - in a real implementation, you would integrate with Stripe
    // For now, we'll just return a mock response
    res.json({ 
      url: `/subscription/success?plan=${plan}`,
      message: 'Checkout session created successfully'
    })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
