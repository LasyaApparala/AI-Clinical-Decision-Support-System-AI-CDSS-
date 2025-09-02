import mongoose from 'mongoose'

const ChatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, index: true, required: true },
  title: String,
  lastMessage: { type: mongoose.Types.ObjectId, ref: 'Message' }
}, { timestamps: true })

export default mongoose.model('ChatSession', ChatSessionSchema)
