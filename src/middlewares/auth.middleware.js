import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Middleware to verify JWT token
export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Access token is missing or invalid");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        
        if (!user) {
            throw new ApiError(401, "User not found or token is invalid");
        }
    
        req.user = user;

        next();
    } catch (error) {

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: "Access token has expired" });
        } else if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: "Invalid access token" });
        } else {
            res.status(401).json({ message: error.message || "Authorization error" });
        }
    }
});
