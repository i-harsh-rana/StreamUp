import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from '../utils/ApiResponse.js'
import { Tweet } from '../models/tweet.model.js'
import { User } from '../models/user.model.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const createTweet = asyncHandler(async(req, res)=>{
    const { content } = req.body

    if(!content){
        throw new ApiError(404, "Plese write some content")
    }

    const newTweet = await Tweet.create({
        owner: req.user._id,
        content: content
    })

    if(!newTweet){
        throw new ApiError(500, "Error in uploading tweet, please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, newTweet, "Tweet uploded sucessfully")
    )
})

const getUserTweet = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "Please provide user ID.");
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const userTweets = await Tweet.aggregate([
        {
            $match: { owner: userObjectId }
        },
        {
            $lookup: {
                from: 'users', 
                localField: 'owner',
                foreignField: '_id',
                as: 'ownerDetails'
            }
        },
        {
            $unwind: '$ownerDetails'
        },
        {
            $project: {
                content: 1,
                'ownerDetails.username': 1 // Include username in the result
            }
        }
    ]);

    if (userTweets.length === 0) {
        throw new ApiError(404, "User doesn't have tweets!");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, userTweets, "All tweets fetched successfully")
        );
})

const updateTweet = asyncHandler(async(req, res)=>{
    const {content} = req.body
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(200, "please provide tweetId")
    }

    if(!content){
        throw new ApiError(200, "please fill all fields")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(400, "No such tweet found")
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400, " your are not authorized to update this tweet")
    }

    tweet.content = content
    const updatedTweet = await tweet.save({validateBeforeSave : false})

    if(!updatedTweet){
        throw new ApiError(500, "Unable to update changes, please try again")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, updatedTweet, "Updated Successfully")
    )
})

const deleteTweet = asyncHandler(async(req, res)=>{
    const {tweetId} = req.params

    if(!tweetId){
        throw new ApiError(200, "please provide tweetId")
    }

    const findTweet = await Tweet.findById(tweetId)

    if(!findTweet){
        throw new ApiError(404, "Such tweet not available")
    }

    if(findTweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(400, "You are not autharized to delete this tweet")
    }

    const tweetToBeDelete = await Tweet.findByIdAndDelete(tweetId)

    if(!tweetToBeDelete){
        throw new ApiError(200, null, "Tweet deleted successfully")
    }
})

export {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}