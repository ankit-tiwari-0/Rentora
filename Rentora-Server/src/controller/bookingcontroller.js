
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
