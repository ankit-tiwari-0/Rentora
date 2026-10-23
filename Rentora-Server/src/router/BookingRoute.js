
import express from "express";
import authUser from "../middleware/auth.js";
import requireOwner from "../middleware/requireOwner .js";

import {
    checkAvailabilityOfCar,
    createBooking,
    getUserBookings,
    getOwnerBookings,
    changeBookingStatus,
} from "../controller/bookingcontroller.js";

const bookingRoute = express.Router();

// Public route
bookingRoute.post(  "/check-availability",checkAvailabilityOfCar);

// Authenticated user routes
bookingRoute.post("/create", authUser, createBooking);
bookingRoute.get("/user", authUser, getUserBookings);

// Owner-only routes
bookingRoute.get( "/owner", authUser, requireOwner,getOwnerBookings);

bookingRoute.post( "/change-status", authUser, requireOwner,changeBookingStatus);

export default bookingRoute;
