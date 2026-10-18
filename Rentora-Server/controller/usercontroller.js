import User from "../model/user";
import bcrypt from 'bcrypt'
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
         const user = await User.create({namw, email, password:hashPassword})

         
    } catch (error) {
        
    }
}