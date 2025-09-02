import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  specialty: String,
  institution: String,
  degreeType: { 
    type: String, 
    enum: ['md', 'do', 'np', 'pa', 'other'],
    default: null 
  },
  clinicianType: { 
    type: String, 
    enum: ['attending', 'resident', 'fellow', 'student'],
    default: null 
  },
  heardFrom: [String], // Array of sources (podcast, twitter, instagram, etc.)
  role: { type: String, enum: ['clinician','admin','auditor'], default: 'clinician' },
  subscription: {
    tier: { type: String, enum: ['free','pro','enterprise'], default: 'free' },
    validUntil: Date
  }
}, { timestamps: true })

// Virtual for full name
UserSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true })

export default mongoose.model('User', UserSchema)
