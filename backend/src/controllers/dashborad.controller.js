import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Subscription } from '../models/subscription.model.js';
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async(req, res)=>{
    const userId = req.user

    if (!userId) {
        throw new ApiError(404, "Please login");
    }

    const findVideosOfChannel = await Video.find({owner: userId._id}).select('-videoFile -description -owner')

    if(findVideosOfChannel.length === 0){
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Channel doesn't have any video")
        )
    }

    const subscribersCount = await Subscription.countDocuments({channel: userId._id})

    const videoId = findVideosOfChannel.map(video => video._id)

    const videoLikes = await Like.countDocuments({video: {$in: videoId}})

    return res
    .status(200)
    .json(
        new ApiResponse(200, {userId, findVideosOfChannel, subscribersCount, videoLikes}, "Channel stats fetched successfully")
    )


})

const getChannelVideos = asyncHandler(async(req, res)=>{
    const user = req.user

    if (!user) {
        throw new ApiError(404, "Please login");
    }

    const findAllVideoOfCurrentChannel = await Video.find({owner: user._id})

    if(findAllVideoOfCurrentChannel.length === 0){
        return res
        .status(200)
        .json(
            new ApiResponse(200, null, "Channel doesn't have any video")
        )
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200, findAllVideoOfCurrentChannel, "All Video Fetdched")
    )
})

export {
    getChannelStats, 
    getChannelVideos
}
