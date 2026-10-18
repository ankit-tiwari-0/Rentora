import User from "../model/user";
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
