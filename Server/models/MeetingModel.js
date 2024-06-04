import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true
    },
    createBy: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export const Meetings = mongoose.model('Meeting', MeetingSchema)
