import mongoose from 'mongoose'

const connectDB = async()=>{
     try {
     await  mongoose.connect(process.env.MONGO_URI)
     console.log("MongoDB connectedSuccessfully")
     } catch (error) {
        console.log("MongoDB connection failed",error.message)  
     }
}

export default connectDB