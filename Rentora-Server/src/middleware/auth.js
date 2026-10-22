
import JWT from "jsonwebtoken";

const authUser = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const decoded = JWT.verify(
            token,
            process.env.JWT_SECRET,
            {
                issuer: "rentora",
                audience: "rentora-users"
            }
        );

        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authUser;