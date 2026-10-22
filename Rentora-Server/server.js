import express from "express"
import "dotenv/config";
import cors from "cors"
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";
import ownerRouter from "./src/router/ownerRouter.js";
import userRouter from "./src/router/userRouter.js";
import carRoute from "./src/router/carRouter.js";


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
app.use('/api/car', carRoute)

app.get('/' ,(req,res)=> res.send("Server is running"))



const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("server running on", PORT);
    
})