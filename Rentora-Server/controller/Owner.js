import User from "../model/user.js";


export const changeRoleToOwner = async (req, res) => {
    try {
        // Get authenticated user's ID from auth middleware
        const userId = req.userId;

        // Find the user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if already an owner
        if (user.role === "owner") {
            return res.status(400).json({
                success: false,
                message: "You are already an owner"
            });
        }

        // Change role to owner
        user.role = "owner";
        await user.save();

        return res.status(200).json({
            success: true,
            message: "You can now list cars",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Change role error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to become an owner"
        });
    }
};
