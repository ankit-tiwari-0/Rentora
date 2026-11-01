import stripe from "../config/stripe.js";
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

// 2. Create a booking and authorize payment
export const createBooking = async (req, res) => {
    let booking;

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

        // Calculate rental price
        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const noOfDays = Math.ceil(
            (dates.returned.getTime() - dates.pickup.getTime()) /
            millisecondsPerDay
        );

        const price = carData.pricePerDay * noOfDays;

        if (!Number.isFinite(price) || price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid rental price",
            });
        }

        // Create booking with a 2-hour deadline
        booking = await Booking.create({
            car: carData._id,
            owner: carData.owner,
            user: userId,
            pickupDate: dates.pickup,
            returnDate: dates.returned,
            price,
            confirmationDeadline: new Date(
                Date.now() + 2 * 60 * 60 * 1000
            ),
        });

        // Create Stripe PaymentIntent with manual capture
        const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(price * 100),
    currency: "inr",
    capture_method: "manual",

    metadata: {
        bookingId: booking._id.toString(),
        userId: userId.toString(),
    },
});

        // Save Stripe PaymentIntent ID
        booking.stripePaymentIntentId = paymentIntent.id;
        await booking.save();

        return res.status(201).json({
            success: true,
            message: "Booking created. Complete card authorization.",
            booking,
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        console.error("Create booking error:", error);

        // Remove incomplete booking if Stripe setup failed
        if (booking?._id) {
            await Booking.findByIdAndDelete(booking._id);
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create booking or authorize payment",
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

        // Validate booking ID
        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
        }

        // Validate status
        if (!["confirmed", "cancelled"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be confirmed or cancelled",
            });
        }

        // Verify owner
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

        // Verify booking ownership
        if (booking.owner.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You cannot update another owner's booking",
            });
        }

        // Only pending bookings can be updated
        if (booking.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Only pending bookings can be updated",
            });
        }

        // Check the two-hour confirmation deadline
        if (
            !booking.confirmationDeadline ||
            new Date() > new Date(booking.confirmationDeadline)
        ) {
            return res.status(400).json({
                success: false,
                message: "The booking confirmation deadline has expired",
            });
        }

        // CONFIRM BOOKING
        if (status === "confirmed") {

            // Verify payment information
           if (!booking.stripePaymentIntentId) {
  return res.status(400).json({
    success: false,
    message: "Payment information not found",
  });
}

            // Recheck vehicle availability
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

            // Verify actual Stripe authorization
          const existingIntent = await stripe.paymentIntents.retrieve(
  booking.stripePaymentIntentId
);

// Verify that this PaymentIntent belongs to this booking
if (
  existingIntent.metadata.bookingId !== booking._id.toString() ||
  existingIntent.metadata.userId !== booking.user.toString()
) {
  return res.status(403).json({
    success: false,
    message: "Payment verification failed",
  });
}

// Stripe must confirm that the card is authorized
if (existingIntent.status !== "requires_capture") {
  return res.status(400).json({
    success: false,
    message: `Card is not authorized. Payment status: ${existingIntent.status}`,
  });
}
            // Capture authorized payment
            const capturedIntent = await stripe.paymentIntents.capture(
                booking.stripePaymentIntentId
            );

            if (capturedIntent.status !== "succeeded") {
                return res.status(400).json({
                    success: false,
                    message: "Payment capture was unsuccessful",
                });
            }

            // Update booking only after successful capture
            booking.status = "confirmed";
            booking.paymentStatus = "paid";
            booking.paidAt = new Date();

            await booking.save();

            return res.status(200).json({
                success: true,
                message: "Booking confirmed and payment captured successfully",
                booking,
            });
        }

        // CANCEL BOOKING
        if (status === "cancelled") {

            if (booking.stripePaymentIntentId) {
                const paymentIntent = await stripe.paymentIntents.retrieve(
                    booking.stripePaymentIntentId
                );

                // Release the authorized amount
                if (paymentIntent.status === "requires_capture") {
                    await stripe.paymentIntents.cancel(
                        booking.stripePaymentIntentId
                    );

                    booking.paymentStatus = "released";
                } else if (paymentIntent.status === "canceled") {
                    booking.paymentStatus = "released";
                } else {
                    return res.status(400).json({
                        success: false,
                        message: `Cannot cancel booking because payment status is ${paymentIntent.status}`,
                    });
                }
            }

            booking.status = "cancelled";

            await booking.save();

            return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                booking,
            });
        }

    } catch (error) {
        console.error("Change booking status error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update booking status",
        });
    }
};