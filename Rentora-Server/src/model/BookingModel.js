
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const bookingSchema = new mongoose.Schema(
    {
        car: {
            type: ObjectId,
            ref: "Car",
            required: true,
        },

        user: {
            type: ObjectId,
            ref: "User",
            required: true,
        },

        owner: {
            type: ObjectId,
            ref: "User",
            required: true,
        },

        pickupDate: {
            type: Date,
            required: true,
        },

        returnDate: {
            type: Date,
            required: true,
        },

        // Booking status
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },

        // Payment status
        paymentStatus: {
            type: String,
            enum: [
                "unpaid",
                "authorized",
                "paid",
                "released",
                "failed",
            ],
            default: "unpaid",
        },

        // Stripe PaymentIntent ID
        stripePaymentIntentId: {
            type: String,
            default: null,
        },

        // Owner must respond within 2 hours
        confirmationDeadline: {
            type: Date,
            default: null,
        },
        paidAt: {
            type: Date,
            default: null,
        },

        // Rental price
        price: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// Index for finding bookings awaiting owner response
bookingSchema.index({
    status: 1,
    confirmationDeadline: 1,
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
