import express from 'express'
import { placeOrder, placeOrderStripe, verifyStripe, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus } from '../controllers/orderController.js'
import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRouter = express.Router()

// Admin routes
orderRouter.get('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// User routes
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)
orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)
orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter

