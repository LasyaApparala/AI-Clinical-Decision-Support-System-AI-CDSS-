import User from '../models/User.js'

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error('Error getting profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function updateProfile(req, res) {
  try {
    const { firstName, lastName, specialty, institution, degreeType, clinicianType } = req.body
    
    const user = await User.findById(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName
    if (specialty !== undefined) user.specialty = specialty
    if (institution !== undefined) user.institution = institution
    if (degreeType !== undefined) user.degreeType = degreeType
    if (clinicianType !== undefined) user.clinicianType = clinicianType

    await user.save()
    
    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-passwordHash')
    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
