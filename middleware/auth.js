import User from "../models/userModel";
import jwt from 'jsonwebtoken'


export const protectRoute = async (req, res, next) => {
    try {
        const token = req?.body?.token;
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userId).select('-password');
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}