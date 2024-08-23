import mongoose from "mongoose";
import {Video} from '../models/video.model.js'
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {asyncHandler} from '../utils/asyncHandler.js'

const getAllVideo = asyncHandler(async(req, res)=>{
    const {page = 1, limit = 10, query, sortBy, sortType, userId} = req.query

})

const publishAVideo = asyncHandler(async(req, res)=>{

    const user = await User.findById(req.user._id);

    if(!user){
        throw new ApiError(401, "Please login")
    }

    const {title, description} = req.body

    if([title, description].some((field)=>field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if(!videoLocalPath){
        throw new ApiError(404, "Please attach video")
    }

    if(!thumbnailLocalPath){
        throw new ApiError(404, "Please attach thumbnail")
    }

    const uploadVideo = await uploadOnCloudinary(videoLocalPath);
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    console.log(uploadVideo)
    
    if(!uploadVideo){
        throw new ApiError(500, "Error in video upload, please try again")
    }

    if(!uploadThumbnail){
        throw new ApiError(500, "Error in thumbnail upload, please try again");
    }

    const video = await Video.create({
        videoFile: uploadVideo?.url,
        thumbnail: uploadThumbnail?.url,
        title: title,
        description: description,
        duration: uploadVideo?.duration,
        owner: user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully"))
}) 

const getVideoById = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    const video = await Video.findById(videoId).select("-thumbnail -isPublished")

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, video, "Video Found!")
    )
})

const updateVideo = asyncHandler(async(req, res)=>{
    const {videoId} = req.params
    const {title, description} = req.body

    if(!title && !description){
        throw new ApiError(400, "Please enter changes")
    }

    const video = await Video.findById(videoId).select('owner')

    if(!video){
        throw new ApiError(404, "Video Not Found")
    }

    if(video.owner.toString()!=req.user._id.toString()){
        throw new ApiError(404, "You are unauthorized to update this video!")
    }

    const updatedVideo = await Video.findByIdAndUpdate(videoId, {$set: {title: title, description: description}}, {new: true}).select("-thumbnail -isPublished")

    if(!updatedVideo){
        throw new ApiError(500, "Error finding video to update")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedVideo, "Updated Successfully")
    )

})

const deleteVideo  = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    const video = await Video.findById(videoId).select("owner")

    if(!video){
        throw new ApiError(404, "Video Not Found")
    }

    if(video.owner.toString() != req.user._id.toString()){
        throw new ApiError(404, "You are unauthorized to delete this video")
    }

    const toBeDeleteVideo = await Video.findByIdAndDelete(videoId)

    if(!toBeDeleteVideo){
        throw new ApiError(500, "Unable to delete at this moment")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Deleted Successfully")
    )
})

const toggleVideoStatus = asyncHandler(async(req, res)=>{
    const {videoId} = req.params

    const video = await Video.findById(videoId).select("owner")

    if(!video){
        throw new ApiError(404, "Video Not Found")
    }

    if(video.owner.toString() != req.user._id.toString()){
        throw new ApiError(404, "You are unauthorized to delete this video")
    }

    const toggleVideo = await Video.findById(videoId)
    toggleVideo.isPublished = toggleVideo.isPublished ? false : true;
    await toggleVideo.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponse( 200, toggleVideo, "Done!")
    )

})

export {
    getAllVideo,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    toggleVideoStatus
}

