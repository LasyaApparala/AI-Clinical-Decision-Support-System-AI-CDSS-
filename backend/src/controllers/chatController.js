import ChatSession from '../models/ChatSession.js'
import Message from '../models/Message.js'
import { processQuery } from '../services/aiClient.js'

export async function createSession(req, res) {
  const session = await ChatSession.create({ userId: req.user.id, title: req.body.title || 'Session' })
  res.json({ sessionId: session._id.toString() })
}

export async function query(req, res, next) {
  try {
    const { sessionId, message, mode, temperature, topK, deepReasoning } = req.body
    if (!sessionId || !message) return res.status(400).json({ error: 'sessionId and message required' })
    
    // Save user message
    const userMessage = await Message.create({ sessionId, userId: req.user.id, role: 'user', content: message })
    
    // Update session with last message
    await ChatSession.findByIdAndUpdate(sessionId, { lastMessage: userMessage._id })
    
    const ai = await processQuery({ sessionId, message, userId: req.user.id, mode, temperature, topK, deepReasoning })
    
    // Save AI response
    const saved = await Message.create({
      sessionId, userId: req.user.id, role: 'assistant',
      content: ai.answer, citations: ai.citations, tokensUsed: ai.tokensUsed, meta: ai.meta
    })
    
    // Update session with AI response as last message
    await ChatSession.findByIdAndUpdate(sessionId, { lastMessage: saved._id })
    
    res.json({ messageId: saved._id.toString(), answer: ai.answer, sources: ai.citations, tokensUsed: ai.tokensUsed })
  } catch (e) { next(e) }
}

export async function history(req, res) {
  const { sessionId } = req.query
  const rows = await Message.find({ sessionId, userId: req.user.id }).sort({ createdAt: 1 })
  res.json(rows.map(r => ({ role: r.role, content: r.content, citations: r.citations, createdAt: r.createdAt })))
}

export async function getSessions(req, res) {
  try {
    const sessions = await ChatSession.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .limit(20)
      .populate({
        path: 'lastMessage',
        select: 'content createdAt',
        options: { sort: { createdAt: -1 }, limit: 1 }
      })

    const sessionsWithTitles = sessions.map(session => {
      // Generate a title from the first user message if no title exists
      let title = session.title
      if (title === 'Session' && session.lastMessage) {
        const firstMessage = session.lastMessage.content
        title = firstMessage.length > 50 ? firstMessage.substring(0, 50) + '...' : firstMessage
      }

      return {
        id: session._id.toString(),
        title: title,
        lastMessage: session.lastMessage ? session.lastMessage.content : '',
        timestamp: session.updatedAt
      }
    })

    res.json(sessionsWithTitles)
  } catch (error) {
    console.error('Error getting sessions:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
