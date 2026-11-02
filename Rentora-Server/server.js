
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./src/config/db.js";
import cookieParser from "cookie-parser";

import ownerRouter from "./src/router/ownerRouter.js";
import userRouter from "./src/router/userRouter.js";
import carRoute from "./src/router/carRouter.js";
import bookingRoute from "./src/router/BookingRoute.js";

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
const allowedOrigins = [
    "http://localhost:5173",
    "https://rentora-black.vercel.app"
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/car", carRoute);
app.use("/api/booking", bookingRoute);

// Health check
app.get("/", (req, res) => {
  res.send("Rentora Server is running!");
});

// Local development only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export Express app for Vercel
export default app;
