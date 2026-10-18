import JWT from 'jsonwebtoken'

const generateToken = (userId)=>{
    const payload = userId;
    return JWT.sign(payload, process.env.JWT_SECRET)
}