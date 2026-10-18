import express from "express"
import "dotenv/config";
import cors from "cors"
import connectDB from "./config/db.js";
import userRouter from "./router/userRouter.js";
import cookieParser from "cookie-parser";
import ownerRouter from "./router/ownerRouter.js";


const app = express()
await connectDB()

//Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

app.use(cors());
app.use(express.json())
app.use(cookieParser());


app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)

app.get('/' ,(req,res)=> res.send("Server is running"))



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("server running on", PORT);
    
})