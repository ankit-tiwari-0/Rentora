import { Router } from "express";
import { getCars, getUserData, loginUser, logoutUser, registerUser } from "../controller/usercontroller.js";
import authUser from "../middleware/auth.js";
const userRouter = Router()


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', authUser, getUserData)
userRouter.get('/cars', getCars)
userRouter.post("/logout", logoutUser);




export default userRouter