import express from 'express'
import { CreateMeeting, FindMeeting } from "../controllers/meetingControllers.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()


router.post("/createmeeting", verifyToken, CreateMeeting)
router.post("/joinmeeting", FindMeeting)

export default router
