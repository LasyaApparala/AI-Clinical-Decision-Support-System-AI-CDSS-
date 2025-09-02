import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import pinoHttp from 'pino-http'
import './config/db.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chat.js'
import userRoutes from './routes/user.js'
import subRoutes from './routes/subscription.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: (process.env.ALLOWED_ORIGINS || '').split(','), credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('combined'))
app.use(pinoHttp())

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/user', userRoutes)
app.use('/api/subscription', subRoutes)

// error handler
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})
export default app
