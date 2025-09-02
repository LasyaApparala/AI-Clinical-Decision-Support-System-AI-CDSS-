// routes/chat.js
import { Router } from 'express'
import { requireAuth } from '../middleware/authMiddleware.js'
import { createSession, query, history, getSessions } from '../controllers/chatController.js'
const r = Router()
r.use(requireAuth)
r.post('/session', createSession)
r.post('/query', query)
r.get('/history', history)
r.get('/sessions', getSessions)
export default r
