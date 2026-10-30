import User from "../model/user.js";

export const changeRoleToOwner = async (req, res) => {
    try {
        const userId = req.userId;

        // Check authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please log in again.",
            });
        }

        // Find authenticated user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Handle existing owner
        if (user.role === "owner") {
            return res.status(200).json({
                success: true,
                message: "You are already an owner.",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });
        }

        // Update user role
        user.role = "owner";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "You can now list your cars!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Change role error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update owner role.",
        });
    }
};