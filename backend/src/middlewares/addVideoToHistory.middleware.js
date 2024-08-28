import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose";

const addVideoToWatchHistory = asyncHandler(async(userId, videoId)=>{
    if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const user = await User.findById(userId)

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.watchHistory.push(videoId)
    await user.save({validateBeforeSave: false})
})

export {addVideoToWatchHistory}