import express from 'express'
import { register, login, googleLogin } from '../controllers/authControllers.js'
import cors from 'cors'

const router = express.Router()

router.all('*', cors())

router.post('/signup', register)
router.post('/login', login)
router.post('/googleLogin', googleLogin)

export default router
