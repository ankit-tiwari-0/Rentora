import { json } from "express"
import User from "../model/user"

//API to List Car

export const addCar = async (req,rea) => {
    try {
        const {_id} = req.User
        let car = JSON.parse(req.body.carData);
        const imagefile = req.file;
        
        
    } catch (error) {
            res.status(500).json({message: error.message})
    }   
}