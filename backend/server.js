import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/mongodb.js'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// App Config
const app = express()
const port = process.env.PORT || 4000

// Connect to Database
connectDB()

// Middlewares
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Serve built React frontend static files


// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const dbState = dbStates[mongoose.connection.readyState] || 'unknown'
  res.json({
    success: true,
    message: 'Backend API operational',
    dbConnected: mongoose.connection.readyState === 1,
    dbState,
    timestamp: new Date()
  })
})

// Root Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Forever Backend API is running 🚀"
  });
});

app.listen(port, () => console.log('🚀 Forever Server running on PORT : ' + port))

