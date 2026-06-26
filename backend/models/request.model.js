import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    businessName: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
})

export const Request = mongoose.model("Request", requestSchema);