
import fs from "fs";
import Car from "../model/carmodel.js";
import imagekit from "../config/imageKit.js";

// API to add a car
export const addCar = async (req, res) => {
    try {
        const userId = req.userId;

        const car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Car image is required",
            });
        }

        // Upload image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path);

        const response = await imagekit.files.upload({
            file: fileBuffer.toString("base64"),
            fileName: imageFile.originalname,
            folder: "/cars",
        });

        // Generate optimized ImageKit URL
        const optimizedImageUrl = imagekit.helper.buildSrc({
            urlEndpoint: process.env.ENDPOINT,
            src: response.filePath,
            transformation: [
                { width: "1280" },
                { quality: "auto" },
                { format: "webp" },
            ],
        });

        // Save car in MongoDB
        await Car.create({
            ...car,
            owner: userId,
            image: optimizedImageUrl,
        });

        return res.status(201).json({
            success: true,
            message: "Car added successfully",
        });
    } catch (error) {
        console.error("Add car error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
