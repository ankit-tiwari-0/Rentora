import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGOOSE)
        console.log("database is connected");
        
    } catch (error) {
        console.log(error.message);
        
    }
}

export default connectDB