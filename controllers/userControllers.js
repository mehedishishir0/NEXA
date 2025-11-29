import cloudinary from "../lib/cloduinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    try {
        const { fullName, email, password, bio } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hasPasswrd = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            password: hasPasswrd,
            bio
        })
        const token = generateToken(newUser._id);

        res.status(201).json({ success: true, message: "User created successfully", data: newUser, token });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export const signin = async (req, res) => {
    try {
        const { fullName, email, password, bio } = req.body;
        const userData = await User.findOne({ email });
        if (!userData) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, userData.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect password" });
        }
        const token = generateToken(userData._id);
        res.status(200).json({ success: true, message: "User signed in successfully", data: userData, token });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const checkAuth = (req, res) => {
    res.status(200).json({ success: true, message: "User is authenticated", data: req.user });
}

export const updateProfile = async (req, res) => {
    try {
        const { bio, name } = req.body;
        const profilePic = req.file?.path;
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let updateUser;

        if (!profilePic) {
            updateUser = await User.findByIdAndUpdate(req.user._id, { name, bio }, { new: true });

        } else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updateUser = await User.findByIdAndUpdate(req.user._id, { name, bio, profilePic: upload.secure_url }, { new: true });
        }

        res.status(200).json({ success: true, message: "User profile updated successfully", data: updateUser });

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }
}