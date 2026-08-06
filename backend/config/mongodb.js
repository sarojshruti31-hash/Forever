import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('✅ MongoDB connection established successfully')
        })

        mongoose.connection.on('error', (err) => {
            console.error('❌ MongoDB connection error:', err.message)
        })

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ MongoDB disconnected')
        })

        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/forever'
        
        // If URI is placeholder, warn user
        if (uri.includes('<username>') || uri.includes('<password>')) {
            console.warn('⚠️ Warning: MONGODB_URI contains placeholders. Falling back to local MongoDB mongodb://127.0.0.1:27017/forever')
            await mongoose.connect('mongodb://127.0.0.1:27017/forever')
        } else {
            await mongoose.connect(uri)
        }
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message)
        console.warn('⚠️ Running backend without active MongoDB connection (API calls requiring DB will return errors until MongoDB is connected).')
    }
}

export default connectDB


