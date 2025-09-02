// routes/user.js
import { Router } from 'express'
import { updateProfile, getProfile } from '../controllers/userController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/profile', authenticateToken, getProfile)
router.put('/profile', authenticateToken, updateProfile)

export default router
