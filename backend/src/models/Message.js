import mongoose from 'mongoose'
const MessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Types.ObjectId, index: true, required: true },
  userId: { type: mongoose.Types.ObjectId, index: true, required: true },
  role: { type: String, enum: ['user','assistant'], required: true },
  content: String,
  citations: [{ id: String, snippet: String, url: String, score: Number }],
  tokensUsed: Number,
  meta: Object
}, { timestamps: true })
export default mongoose.model('Message', MessageSchema)
