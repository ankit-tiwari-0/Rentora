import User from "../model/user.js";

const requireOwner = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("role");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.role !== "owner") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Owners only.",
            });
        }

        next();
    } catch (error) {
        console.error("Owner authorization error:", error);

        return res.status(500).json({
            success: false,
            message: "Authorization failed",
        });
    }
};

export default requireOwner;