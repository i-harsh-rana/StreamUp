import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js'
import { Tweet } from '../models/tweet.model.js'
import { User } from '../models/user.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async(req, res)=>{

})

const getUserTweet = asyncHandler(async(req, res)=>{

})

const updateTweet = asyncHandler(async(req, res)=>{

})

const deleteTweet = asyncHandler(async(req, res)=>{

})

export {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}