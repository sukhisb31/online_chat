import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName : {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    avtar :{
        public_id: String,
        url: String,
    },
},
{ timestamp: true }
);

export const User = mongoose.model("User", userSchema);