
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

export const register = async (req, res) => {
  try {
    const { email, password, contact, adminSecretKey } = req.body

    if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ message: 'Admin secret key Invalid' })
    }

    const already = await User.findOne({ email })
    if (already) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const admin = await User.create({
      name: 'Admin',
      email,
      password: hashedPassword,
      contact,
      role: 'admin'
    })

    const token = generateToken(res, admin)

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      user: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password, role, adminSecretKey } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are Required' })
    }

    if (role === 'admin') {
      if (!adminSecretKey || adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ message: 'Admin secret key Invalid' })
      }
    }

    const user = await User.findOne({ email, role }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Password' })
    }

    const token = generateToken(res, user)

    res.json({
      message: 'Login Successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}