import mongoose from 'mongoose'


export const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=> console.log("Connected to MongoDB"))
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Error connecting to MongoDB:', error)
    }
}

