// routes/subscription.js
import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { status, upgrade, createCheckoutSession } from '../controllers/subscriptionController.js'
const r = Router()
r.use(requireAuth)
r.get('/status', status)
r.post('/upgrade', upgrade)
r.post('/create-checkout-session', createCheckoutSession)
export default r
