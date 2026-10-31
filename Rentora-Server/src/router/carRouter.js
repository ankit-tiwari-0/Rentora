import { Router } from "express";
import upload from "../middleware/multer.js";
import authUser from "../middleware/auth.js";
import { addCar, DeleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from "../controller/carcontroller.js";
import requireOwner from "../middleware/requireOwner .js";



const carRoute = Router()

carRoute.post("/add-car", upload.single("image"),authUser,requireOwner, addCar )
carRoute.get("/cars",authUser,requireOwner, getOwnerCars )
carRoute.get("/toggle-car",authUser,requireOwner, toggleCarAvailability )
carRoute.delete("/delete-car/:carId", authUser, requireOwner, DeleteCar);
carRoute.get("/dashboard",authUser,requireOwner, getDashboardData )
carRoute.post('/update-image',upload.single("image"),authUser,updateUserImage)


export default carRoute;