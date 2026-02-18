import bcrypt from 'bcryptjs'
import User from '../models/User.js'

// Admin — manager ya agent banaye
export const createUser = async (req, res) => {
  try {
    const { name, email, password, contact, department, role } = req.body

    if (!['manager', 'agent'].includes(role)) {
      return res.status(400).json({ message: 'Sirf manager ya agent bana sakte ho' })
    }

    const already = await User.findOne({ email })
    if (already) {
      return res.status(400).json({ message: 'Ye email pehle se registered hai' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contact,
      department,
      role,
      createdBy: req.user._id
    })

    res.status(201).json({ message: `${role} created`, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

