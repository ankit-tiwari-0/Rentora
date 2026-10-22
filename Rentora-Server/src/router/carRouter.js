import { Router } from "express";
import upload from "../middleware/multer.js";
import authUser from "../middleware/auth.js";
import { addCar } from "../controller/carcontroller.js";



const carRoute = Router()

carRoute.post("/add-car", upload.single("image"),authUser, addCar )


export default carRoute;