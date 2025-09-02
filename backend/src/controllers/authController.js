import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const sign = (user) => jwt.sign({ 
  id: user._id, 
  email: user.email, 
  role: user.role, 
  name: user.name 
}, process.env.JWT_ACCESS_SECRET, { 
  expiresIn: `${process.env.ACCESS_TOKEN_TTL_MIN || 15}m` 
})

export async function signup(req, res) {
  const { 
    firstName, 
    lastName, 
    email, 
    password, 
    specialty, 
    institution, 
    degreeType, 
    clinicianType, 
    heardFrom 
  } = req.body

  // Validate required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'First name, last name, email, and password are required' })
  }

  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ error: 'Email already registered' })

  const passwordHash = await bcrypt.hash(password, 10)
  
  const user = await User.create({ 
    firstName, 
    lastName, 
    email, 
    passwordHash, 
    specialty, 
    institution, 
    degreeType, 
    clinicianType, 
    heardFrom 
  })

  return res.json({ 
    token: sign(user), 
    user: { 
      id: user.id, 
      email, 
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      specialty: user.specialty,
      institution: user.institution,
      degreeType: user.degreeType,
      clinicianType: user.clinicianType
    } 
  })
}

export async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  return res.json({ 
    token: sign(user), 
    user: { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      specialty: user.specialty,
      institution: user.institution,
      degreeType: user.degreeType,
      clinicianType: user.clinicianType
    } 
  })
}
