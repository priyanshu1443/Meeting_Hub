import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    name: {
        type: String
    },
    image: {
        type: Object
    },
    time: {
        type: Date,
        default: Date.now
    }
})


export const Registration = mongoose.model('User', UserSchema)
