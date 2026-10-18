import User from "../model/user.js";
import bcrypt from 'bcrypt'
import generateToken from "../config/JWT.js";

export const registerUser = async (req, res)=>{
    try {
        const {name, email, password} = req.body;
       
         if (!name || !email || !password || password.length <8) {
            return res.json({success: false, message: 'Fill all the fields'})
         }

         const userExists = await User.findOne({email})
         if (userExists) {
            return res.json({success: false, message: 'User already exists'})
         }

         const hashPassword = await bcrypt.hash(password, 10)
         const user = await User.create({name, email, password:hashPassword})
         const token = generateToken(user._id.toString())

         res.json({success: true , token})

    } catch (error) {
            res.status(500).json({message: error.message})
    }
}

//Login fnction



export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all fields"
            });
        }

        // 2. Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Compare password
        const isPasswordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 4. Generate JWT
        const token = generateToken(user._id.toString());

        // 5. Store JWT in an HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        // 6. Send response without exposing the token
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




export const getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user data"
        });
    }
};
