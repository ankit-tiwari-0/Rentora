import { Router } from "express";
import upload from "../middleware/multer.js";
import authUser from "../middleware/auth.js";
import { addCar, DeleteCar, getOwnerCars, toggleCarAvailability } from "../controller/carcontroller.js";
import requireOwner from "../middleware/requireOwner .js";



const carRoute = Router()

carRoute.post("/add-car", upload.single("image"),authUser,requireOwner, addCar )
carRoute.get("/cars",authUser,requireOwner, getOwnerCars )
carRoute.get("/toggle-car",authUser,requireOwner, toggleCarAvailability )
carRoute.get("/delete-car",authUser,requireOwner, DeleteCar )


export default carRoute;