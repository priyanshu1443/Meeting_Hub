import { Registration } from '../models/UserModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    const { email, password, confirmPassword, name } = req.body
    if (email && password && confirmPassword && password === confirmPassword && name) {
        try {
            const user = await Registration.findOne({ email })
            if (user) {
                res.status(409).send({ "message": "Email id is already registered" })
            } else {
                const hashPassword = await bcrypt.hash(password, 12)
                const newUser = await Registration.create({ email, password: hashPassword, name })
                res.status(201).send({ message: "Registered Successfully" })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    } else {
        res.status(404).send({ message: "fill all the field correctly" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email && !password) {
        res.send(401).send({ message: "Please provide an Email and Password" })
    }
    try {
        const user = await Registration.findOne({ email })
        if (!user) {
            res.status(401).send({ message: "UserName and passsword is incorrrect" })
            return
        }
        const matchPassword = await bcrypt.compare(password, user.password)
        if (matchPassword) {
            const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
            res.header("Access-Control-Allow-Origin", process.env.CLINT_PORT)
            res.status(201).send({
                message: "Login Successfully", data: {
                    email: user.email,
                    user_id: user._id,
                    name: user.name,
                    token: token
                }
            })
        } else {
            res.status(401).send({ message: "UserName and passsword is incorrrect" })
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

export const googleLogin = async (req, res) => {
    const { email, name, picture, } = req.body
    if (email, name, picture) {
        try {
            const user = await Registration.findOne({ email })
            if (user) {
                const token = jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
                res.header("Access-Control-Allow-Origin", process.env.CLINT_PORT)
                res.status(201).send({
                    message: "Login Successfully", data: {
                        email: user.email,
                        user_id: user._id,
                        name: user.name,
                        token: token
                    }
                })
            } else {
                const newUser = await Registration.create({ email, password: null, name, image: { url: picture } })
                const token = jwt.sign({ email: newUser.email, id: newUser._id, name: newUser.name }, process.env.JWT_SECRET_KEY, { expiresIn: '24h' })
                res.header("Access-Control-Allow-Origin", process.env.CLINT_PORT)
                res.status(201).send({
                    message: "Login Successfully", data: {
                        email: user.email,
                        user_id: user._id,
                        name: user.name,
                        token: token
                    }
                })
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }
}
