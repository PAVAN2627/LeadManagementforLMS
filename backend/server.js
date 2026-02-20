import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth',  authRoutes)
app.use('/api/add', userRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})