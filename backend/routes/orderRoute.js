import express from 'express'
import {
    placeOrder,
    placeOrderStripe,
    verifyStripe,
    placeOrderRazorpay,
    verifyRazorpay,
    allOrders,
    userOrders,
    updateStatus,
    getOrderById
} from '../controllers/orderController.js'

import authUser from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRouter = express.Router()

// ================= ADMIN ROUTES =================
orderRouter.get('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

// ================= USER ROUTES =================
orderRouter.post('/place', authUser, placeOrder)
orderRouter.post('/stripe', authUser, placeOrderStripe)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

orderRouter.post('/verifyStripe', authUser, verifyStripe)
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpay)

orderRouter.post('/userorders', authUser, userOrders)

// ⭐ NEW TRACK ORDER ROUTE ⭐
orderRouter.get('/:id', authUser, getOrderById)

export default orderRouter