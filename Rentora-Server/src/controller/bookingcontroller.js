
import mongoose from "mongoose";
import Booking from "../model/BookingModel.js";
import Car from "../model/carmodel.js";
import User from "../model/user.js";

// Helper: Validate dates
const validateDates = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returned = new Date(returnDate);

    if (
        !pickupDate ||
        !returnDate ||
        Number.isNaN(pickup.getTime()) ||
        Number.isNaN(returned.getTime()) ||
        returned <= pickup
    ) {
        return null;
    }

    return { pickup, returned };
};

// Helper: Find an overlapping booking
const findConflictingBooking = async (
    carId,
    pickupDate,
    returnDate,
    excludeBookingId = null
) => {
    const query = {
        car: carId,
        status: { $in: ["pending", "confirmed"] },
        pickupDate: { $lt: returnDate },
        returnDate: { $gt: pickupDate },
    };

    // Exclude the current booking when confirming it
    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    return Booking.findOne(query);
};

// 1. Check available cars for a location and date range
export const checkAvailabilityOfCar = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        if (
            typeof location !== "string" ||
            !location.trim() ||
            !pickupDate ||
            !returnDate
        ) {
            return res.status(400).json({
                success: false,
                message: "Location, pickup date and return date are required",
            });
        }

        const dates = validateDates(pickupDate, returnDate);

        if (!dates) {
            return res.status(400).json({
                success: false,
                message: "Invalid dates. Return date must be after pickup date",
            });
        }

        const cars = await Car.find({
            location: location.trim(),
            isAvailable: true,
            isListed: true,
        }).lean();

        // Check bookings for all matching cars
        const availableCars = [];

        for (const car of cars) {
            const conflict = await findConflictingBooking(
                car._id,
                dates.pickup,
                dates.returned
            );

            if (!conflict) {
                availableCars.push(car);
            }
        }

        return res.status(200).json({
            success: true,
            count: availableCars.length,
            availableCars,
        });
    } catch (error) {
        console.error("Check availability error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to check car availability",
        });
    }
};

// 2. Create a booking
export const createBooking = async (req, res) => {
    try {
        const userId = req.userId;
        const { car, pickupDate, returnDate } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please log in first",
            });
        }

        if (!car || !pickupDate || !returnDate) {
            return res.status(400).json({
                success: false,
                message: "Car, pickup date and return date are required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(car)) {
            return res.status(400).json({
                success: false,
                message: "Invalid car ID",
            });
        }

        const dates = validateDates(pickupDate, returnDate);

        if (!dates) {
            return res.status(400).json({
                success: false,
                message: "Invalid dates. Return date must be after pickup date",
            });
        }

        const carData = await Car.findOne({
            _id: car,
            isAvailable: true,
            isListed: true,
        });

        if (!carData) {
            return res.status(404).json({
                success: false,
                message: "Car is unavailable or not found",
            });
        }

        // An owner cannot book their own car
        if (carData.owner.toString() === userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot book your own car",
            });
        }

        const conflict = await findConflictingBooking(
            carData._id,
            dates.pickup,
            dates.returned
        );

        if (conflict) {
            return res.status(409).json({
                success: false,
                message: "Car is already booked for these dates",
            });
        }

        // Calculate price based on rental days
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const noOfDays = Math.ceil(
            (dates.returned.getTime() - dates.pickup.getTime()) /
            millisecondsPerDay
        );

        const price = carData.pricePerDay * noOfDays;

        const booking = await Booking.create({
            car: carData._id,
            owner: carData.owner,
            user: userId,
            pickupDate: dates.pickup,
            returnDate: dates.returned,
            price,
        });

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking,
        });
    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
        });
    }
};

// 3. Get bookings for the logged-in user
export const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Please log in first",
            });
        }

        const bookings = await Booking.find({ user: userId })
            .populate("car")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error("Get user bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your bookings",
        });
    }
};

// 4. Get bookings belonging to the logged-in owner
export const getOwnerBookings = async (req, res) => {
    try {
        const userId = req.userId;

        // requireOwner middleware should protect this route
        const user = await User.findById(userId).select("role");

        if (!user || user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only owners can access these bookings",
            });
        }

        const bookings = await Booking.find({ owner: userId })
            .populate("car")
            .populate("user", "-password -passwordHash")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error("Get owner bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch owner bookings",
        });
    }
};

// 5. Change booking status
export const changeBookingStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const { bookingId, status } = req.body;

        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
        }

        if (!["confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be confirmed or cancelled",
            });
        }

        const owner = await User.findById(userId).select("role");

        if (!owner || owner.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Only owners can update booking status",
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // An owner can update only their own bookings
        if (booking.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot update another owner's booking",
            });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending bookings can be updated",
            });
        }

        // Recheck availability before confirming
        if (status === "confirmed") {
            const conflict = await findConflictingBooking(
                booking.car,
                booking.pickupDate,
                booking.returnDate,
                booking._id
            );

            if (conflict) {
                return res.status(409).json({
                    success: false,
                    message: "These dates conflict with another booking",
                });
            }
        }

        booking.status = status;
        await booking.save();

        return res.status(200).json({
            success: true,
            message: `Booking ${status} successfully`,
            booking,
        });
    } catch (error) {
        console.error("Change booking status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update booking status",
        });
    }
};
