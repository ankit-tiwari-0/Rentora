
import Booking from "../model/Booking.js";
import Car from "../model/carmodel.js";

// Function to check availability of a car for given dates
const checkAvailability = async (car, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car,
        status: { $in: ["pending", "confirmed"] },
        pickupDate: { $lt: returnDate },
        returnDate: { $gt: pickupDate },
    });

    return bookings.length === 0;
};



// API to check availability of cars for a given date and location
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        if (!location || !pickupDate || !returnDate) {
            return res.status(400).json({
                success: false,
                message: "Location, pickup date and return date are required",
            });
        }

        if (new Date(returnDate) <= new Date(pickupDate)) {
            return res.status(400).json({
                success: false,
                message: "Return date must be after pickup date",
            });
        }

        // Fetch cars for the given location
        const cars = await Car.find({
            location,
            isAvailable: true,
            isListed: true,
        });

        // Check availability for the requested date range
        const availableCarsPromises = cars.map(async (car) => {
            const isAvailable = await checkAvailability(
                car._id,
                pickupDate,
                returnDate
            );

            return {
                ...car.toObject(),
                isAvailable,
            };
        });

        let availableCars = await Promise.all(availableCarsPromises);

        // Return only cars available for the requested dates
        availableCars = availableCars.filter(
            (car) => car.isAvailable === true
        );

        return res.status(200).json({
            success: true,
            availableCars,
        });
    } catch (error) {
        console.error("Check availability error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// API to Create Booking
export const createBooking = async (req, res) => {
    try {
        const userId = req.userId;
        const { car, pickupDate, returnDate } = req.body;

        // Check required fields
        if (!car || !pickupDate || !returnDate) {
            return res.status(400).json({
                success: false,
                message: "Car, pickup date and return date are required",
            });
        }

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        if (
            Number.isNaN(picked.getTime()) ||
            Number.isNaN(returned.getTime()) ||
            returned <= picked
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid pickup or return date",
            });
        }

        // Check car availability for the selected dates
        const isAvailable = await checkAvailability(
            car,
            picked,
            returned
        );

        if (!isAvailable) {
            return res.status(409).json({
                success: false,
                message: "Car is not available for these dates",
            });
        }

        const carData = await Car.findById(car);

        if (!carData || !carData.isAvailable || carData.isListed === false) {
            return res.status(404).json({
                success: false,
                message: "Car is unavailable or not found",
            });
        }

        // Calculate rental price
        const noOfDays = Math.ceil(
            (returned - picked) / (1000 * 60 * 60 * 24)
        );

        const price = carData.pricePerDay * noOfDays;

        // Create booking
        const booking = await Booking.create({
            car,
            owner: carData.owner,
            user: userId,
            pickupDate: picked,
            returnDate: returned,
            price,
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking,
        });
    } catch (error) {
        console.error("Create booking error:", error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


 // API to List User Bookings
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId;

        const bookings = await Booking.find({
            user: userId,
        })
            .populate("car")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


 // API to get Owner Bookings
export const getOwnerBookings = async (req, res) => {
    try {
        if (req.user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const bookings = await Booking.find({
            owner: req.user._id,
        })
            .populate("car user")
            .select("-user.password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            bookings,
        });
    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
