import { Router } from "express";
import { getUserData, loginUser, logoutUser, registerUser } from "../controller/usercontroller.js";
import authUser from "../middleware/auth.js";
const userRouter = Router()


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', authUser, getUserData)
userRouter.post("/logout", logoutUser);




export default userRouter