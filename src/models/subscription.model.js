import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({},{timestamps: true})

export const Subscription = mongoose.model("Subscription", SubscriptionSchema)