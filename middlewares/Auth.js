import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from '../models/Users.models.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "100d",
    });
};

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer"))
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password"); // exclude password from the result.
            next();
        } catch (error) {
            // console.error(error.message);
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});

const admin = asyncHandler(async (req, res, next) => {
    try {
        if (req.user && req.user.isAdmin) {
            next();
        } else {
            res.status(401);
            throw new Error('Not authorized as an admin');
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
});


export { generateToken, protect, admin };