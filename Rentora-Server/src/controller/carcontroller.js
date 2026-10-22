import { json } from "express"
import User from "../model/user.js";
import fs from 'fs';
import Car from "../model/carmodel.js";
import imagekit from "../config/imageKit.js";
//API to List Car

export const addCar = async (req, res) => {
    try {
        const { _id } = req.userId;
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
                {width: '1280'},
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