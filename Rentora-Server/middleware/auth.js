
import JWT from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token missing."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = JWT.verify(token, process.env.JWT_SECRET);

        // Your current generateToken() signs the user ID as a string
        req.userId = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authUser;
