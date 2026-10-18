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
        console.log("Login body:", req.body);


        const { email, password } = req.body;
                console.log("Email:", email);

        

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

        // 3. Compare password with hashed password
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

        // 4. Generate JWT token
        const token = generateToken(user._id.toString());

        // 5. Send response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

