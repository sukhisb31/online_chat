import mongoose from "mongoose";


export const messageSchema = new mongoose.model(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        text: String,
        media: String,
    },
    { timestamps : true },
);

export const Message = mongoose.model ("Message", messageSchema)