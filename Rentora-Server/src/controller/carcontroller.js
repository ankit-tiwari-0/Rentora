import { json } from "express"
import User from "../model/user";
import fs from 'fs';
import Car from "../model/carmodel";

//API to List Car

export const addCar = async (req, rea) => {
    try {
        const { _id } = req.User;
        let car = JSON.parse(req.body.carData);
        const imagefile = req.file;

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imagefile.path);

        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imagefile.originalname,
            folder: '/cars'
        });

        // Optimization through ImageKit URL transformation
        var optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                {with: '1280'},
                {quality: 'auto'},
                {format: 'webp'}
                ]
        });
          
        const image = optimizedImageUrl;
        await Car.create({...car, owner: _id, image})

        res.json({success: true, message: "Car Added"})

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}