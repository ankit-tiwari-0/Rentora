import mongoose from "mongoose";
import fs from "fs";
import Car from "../model/carmodel.js";
import imagekit from "../config/imageKit.js";
import Booking from "../model/BookingModel.js";

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



// API to list cars belonging to the logged-in owner
export const getOwnerCars = async (req, res) => {
  try {
    const owner = req.userId;

    const cars = await Car.find({ owner });

    return res.status(200).json({
      success: true,
      cars,
    });
  } catch (error) {
    console.error("Get owner cars error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch owner cars",
    });
  }
};


// API to toggle car availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const userId = req.userId;
    const { carId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car ID",
      });
    }

    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    // Ensure the car belongs to the logged-in owner
    if (car.owner.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this car",
      });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    return res.status(200).json({
      success: true,
      message: "Car availability updated successfully",
      isAvailable: car.isAvailable,
    });
  } catch (error) {
    console.error("Toggle car availability error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update car availability",
    });
  }
};

//delete

export const DeleteCar = async (req, res) => {
    try {
        const userId = req.userId;
        const { carId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(carId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid car ID",
            });
        }

        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({
                success: false,
                message: "Car not found",
            });
        }

        // Verify ownership
        if (car.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to remove this car",
            });
        }

        // Remove from active listings without deleting the record
        car.isListed = false;
        car.isAvailable = false;

        await car.save();

        return res.status(200).json({
            success: true,
            message: "Car removed from listings successfully",
        });
    } catch (error) {
        console.error("Remove car error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to remove car from listings",
        });
    }
};

// API to get owner dashboard data
export const getDashboardData = async (req, res) => {
    try {
        const ownerId = req.userId;

        if (!ownerId) {
            return res.status(401).json({
                success: false,
                message: "Please log in first",
            });
        }

        // Calculate the current month's date range
        const now = new Date();

        const monthStart = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const nextMonthStart = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        // Fetch cars, recent bookings, and statistics concurrently
        const [
            cars,
            recentBookings,
            totalBookings,
            pendingBookings,
            confirmedBookings,
            cancelledBookings,
            monthlyRevenue,
        ] = await Promise.all([
            // Fetch all cars belonging to this owner
            Car.find({ owner: ownerId })
                .sort({ createdAt: -1 })
                .lean(),

            // Fetch the five most recent bookings
            Booking.find({ owner: ownerId })
                .populate("car")
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Total bookings
            Booking.countDocuments({
                owner: ownerId,
            }),

            // Pending bookings
            Booking.countDocuments({
                owner: ownerId,
                status: "pending",
            }),

            // Confirmed bookings
            Booking.countDocuments({
                owner: ownerId,
                status: "confirmed",
            }),

            // Cancelled bookings
            Booking.countDocuments({
                owner: ownerId,
                status: "cancelled",
            }),

            // Value of confirmed bookings created this month
            Booking.aggregate([
                {
                    $match: {
                        owner: new mongoose.Types.ObjectId(ownerId),
                        status: "confirmed",
                        createdAt: {
                            $gte: monthStart,
                            $lt: nextMonthStart,
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$price",
                        },
                    },
                },
            ]),
        ]);

        // Car statistics
        const totalCars = cars.length;

        const listedCars = cars.filter(
            (car) => car.isListed !== false
        ).length;

        const unlistedCars = totalCars - listedCars;

        const availableCars = cars.filter(
            (car) =>
                car.isAvailable === true &&
                car.isListed !== false
        ).length;

        const unavailableCars = cars.filter(
            (car) =>
                car.isAvailable === false &&
                car.isListed !== false
        ).length;

        // Monthly confirmed booking value
        const monthlyConfirmedBookingValue =
            monthlyRevenue[0]?.total ?? 0;

        // Prepare dashboard response
        const dashboardData = {
            // Car statistics
            totalCars,
            listedCars,
            unlistedCars,
            availableCars,
            unavailableCars,

            // Booking statistics
            totalBookings,
            pendingBookings,
            confirmedBookings,
            cancelledBookings,

            // Revenue-related statistic
            monthlyConfirmedBookingValue,

            // Recent activity
            recentBookings,

            // Complete car list
            cars,
        };

        return res.status(200).json({
            success: true,
            message: "Owner dashboard data fetched successfully",
            dashboardData,
        });
    } catch (error) {
        console.error("Get owner dashboard data error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch owner dashboard data",
        });
    }
};