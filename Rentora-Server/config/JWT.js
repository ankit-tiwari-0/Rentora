
import JWT from "jsonwebtoken";

const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return JWT.sign(
        { id: userId },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
            issuer: "rentora",
            audience: "rentora-users"
        }
    );
};

export default generateToken;
