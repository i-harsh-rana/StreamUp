import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {refreshToken, accessToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generate access and refresh token")
    }
}

const registerUser = asyncHandler(async(req, res) => {
    //get user detail from frontend
    //validation - not empty 
    //chech if user is unique - username or email
    //check for image and avatar
    //upload media on cloudinary
    //create user object = create entry in DB
    //remove pasword and refresh token field from reponse 
    // retunr response  

    const {fullName, email, username, password} = req.body

    if([fullName, email, username, password].some((field)=>field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User is already esist, Please login")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({
        fullName, 
        avatar: avatar.url,
        coverImage: coverImage?.url  || "",
        email, 
        password, 
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong, server error")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
});

const loginUser = asyncHandler(async(req, res)=>{
    //req boby -> data
    //username or email
    //find user
    //password check
    //access and refresh token 
    //send cookie

    const {email, username, password} = req.body

    if ((!username && !email) || !password) {
        throw new ApiError(400, "Username or email and password are required");
    }
    

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist, please signup")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password, please try again")
    }

    const {refreshToken, accessToken} = await  generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true, 
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )

});

const logoutUser = asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true, 
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
});

const refreshAccessToken = asyncHandler(async(req, res)=>{
    const incomingRefreshToken = req.cookie.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError(401, "Refresh token is expoired")
        }
    
        const {newrefreshToken, accessToken} = await generateAccessAndRefreshToken(user._id)
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newrefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})

const changePassword = asyncHandler(async(req, res)=>{
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword) {
        throw new ApiError(400, "Old password is required");
    }
    
    const user = await User.findById(req.user._id).select('+password');

    const isCorrectPassword = await user.isPasswordCorrect(oldPassword)

    if(!isCorrectPassword){
        throw new ApiError (400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password changed!")
    )
})
 
const getCurrentUser = asyncHandler(async(req, res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {fullName, email} = req.body

    if(!fullName && !email){
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id, { $set:{ fullName, email } }, {new: true}).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse( 200, user, "Account details updated")
    )
})

const updateUserAvatar = asyncHandler(async(req, res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Error while uploading on avatar")
    }
    const user = await User.findByIdAndUpdate(req.user._id, {$set: {avatar: avatar.url}},{new: true}).select("-password")
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User avatar updated")
    )
})

const updateUserCoverImage = asyncHandler(async( req, res )=>{
    const coverImagePath = req.file?.path

    if(!coverImagePath){
        throw new ApiError(400, "cover image is required")
    }

    const coverImage = await uploadOnCloudinary(coverImagePath)

    const user = await User.findByIdAndUpdate(req.user?._id, {$set: {coverImage: coverImage.url}}, {new : true}).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image is updated")
    )
})

const getUserProfile = asyncHandler(async(req, res)=>{
    const {username} = req.params

    if(!username?.trim()){
        throw new ApiError( 400, " User not found")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelsSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                coverImage: 1,
                avatar: 1,
                email: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel, "Profile data sent sucessfully")
    )
})

const getWatchHistory = asyncHandler(async(req, res)=>{
   //---->>> req.user._id //this will not return mongoDB id, this return mongoDb ID's String, mongoose convert it to ID, but in aggrigation, mongoose will not help
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        }, 
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline:[
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first : "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch history fetched successfully"
        )
    )
})

const clearWatchHistory = asyncHandler(async(req, res)=>{
    const user = req.user._id

    const clean = await User.findByIdAndUpdate(user, {$set: {watchHistory : []}}, {new: true}).select('watchHistory')

    if(!clean){
        throw new ApiError(500, "Unable to clear watch history")
    }
    
    return res
    .status(200)
    .json(
        new ApiResponse(200, clean, "User Watch History Deleted")
    )
})

export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    changePassword, 
    getCurrentUser, 
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserProfile,
    getWatchHistory,
    clearWatchHistory 
}