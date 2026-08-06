import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import Stripe from 'stripe'
import razorpay from 'razorpay'

// global variables
const currency = 'inr'
const deliveryCharge = 10

// Stripe and Razorpay instances (initialized conditionally)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const razorpayInstance = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
    ? new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
    : null

// placing order using cod
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, { cartData: {} })

        res.json({
            success: true,
            message: "Order Placed Successfully"
        })

    } catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// place order using stripe
const placeOrderStripe = async (req, res) => {
    try {

        const { userId, items, amount, address } = req.body
        const { origin } = req.headers

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        if (stripe) {

            const line_items = items.map((item) => ({
                price_data: {
                    currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            }))

            line_items.push({
                price_data: {
                    currency,
                    product_data: {
                        name: "Delivery Charge"
                    },
                    unit_amount: deliveryCharge * 100
                },
                quantity: 1
            })

            const session = await stripe.checkout.sessions.create({
                success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
                cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
                line_items,
                mode: "payment"
            })

            res.json({
                success: true,
                session_url: session.url
            })

        } else {

            await orderModel.findByIdAndUpdate(newOrder._id, {
                payment: true
            })

            await userModel.findByIdAndUpdate(userId, {
                cartData: {}
            })

            res.json({
                success: true,
                message: "Order Placed (Stripe Test Mode)",
                orderId: newOrder._id
            })
        }

    } catch (error) {
        console.error(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

// verify stripe
const verifyStripe = async (req, res) => {

    const { orderId, success, userId } = req.body

    try {

        if (success === true || success === "true") {

            await orderModel.findByIdAndUpdate(orderId, {
                payment: true
            })

            await userModel.findByIdAndUpdate(userId, {
                cartData: {}
            })

            res.json({
                success: true,
                message: "Payment Verified"
            })

        } else {

            await orderModel.findByIdAndDelete(orderId)

            res.json({
                success: false,
                message: "Payment Failed"
            })

        }

    } catch (error) {

        console.error(error)

        res.json({
            success: false,
            message: error.message
        })

    }

}

// place order using razorpay
const placeOrderRazorpay = async (req, res) => {

    try {

        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)

        await newOrder.save()

        if (razorpayInstance) {

            const options = {
                amount: amount * 100,
                currency: currency.toUpperCase(),
                receipt: newOrder._id.toString()
            }

            const order = await razorpayInstance.orders.create(options)

            res.json({
                success: true,
                order
            })

        } else {

            await orderModel.findByIdAndUpdate(newOrder._id, {
                payment: true
            })

            await userModel.findByIdAndUpdate(userId, {
                cartData: {}
            })

            res.json({
                success: true,
                message: "Order Placed (Razorpay Test Mode)",
                orderId: newOrder._id
            })

        }

    } catch (error) {

        console.error(error)

        res.json({
            success: false,
            message: error.message
        })

    }

}

// verify razorpay
const verifyRazorpay = async (req, res) => {

    try {

        const { userId, razorpay_order_id } = req.body

        if (razorpayInstance) {

            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

            if (orderInfo.status === "paid") {

                await orderModel.findByIdAndUpdate(orderInfo.receipt, {
                    payment: true
                })

                await userModel.findByIdAndUpdate(userId, {
                    cartData: {}
                })

                return res.json({
                    success: true,
                    message: "Payment Successful"
                })

            }

            return res.json({
                success: false,
                message: "Payment Failed"
            })

        }

        await userModel.findByIdAndUpdate(userId, {
            cartData: {}
        })

        res.json({
            success: true,
            message: "Payment Verified (Test Mode)"
        })

    } catch (error) {

        console.error(error)

        res.json({
            success: false,
            message: error.message
        })

    }

}

// all orders data for admin
const allOrders = async (req, res) => {

    try {

        const orders = await orderModel.find({})

        res.json({
            success: true,
            orders
        })

    } catch (error) {

        console.error(error)

        res.json({
            success: false,
            message: error.message
        })

    }

}

// user orders
const userOrders = async (req, res) => {

    try {

        const { userId } = req.body

        const orders = await orderModel.find({ userId }).sort({ date: -1 })

        res.json({
            success: true,
            orders
        })

    } catch (error) {

        console.error(error)

        res.json({
            success: false,
            message: error.message
        })

    }

}

// ⭐ NEW GET SINGLE ORDER ⭐
const getOrderById = async (req, res) => {

    try {

        const { id } = req.params

        const order = await orderModel.findById(id)

        if (!order) {
            return res.json({
                success: false,
                message: "Order not found"
            })
        }

        res.json({
            success: true,
            order
        })

    } catch (error) {

        console.error(error)

        res.json({
            success: false,
            message: error.message
        })

    }

}

// update order status
const updateStatus = async (req, res) => {

    try {

        const { orderId, status } = req.body

        await orderModel.findByIdAndUpdate(orderId, {
            status
        })

        res.json({
            success: true,
            message: "Status Updated Successfully"
        })

    } catch (error) {

        console.error(error)

        res.json({
            success: false,
            message: error.message
        })

    }

}

export {
    placeOrder,
    placeOrderStripe,
    verifyStripe,
    placeOrderRazorpay,
    verifyRazorpay,
    allOrders,
    userOrders,
    getOrderById,
    updateStatus
}