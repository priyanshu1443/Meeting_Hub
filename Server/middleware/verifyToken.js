import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        let decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.id = decodeData?.id
        next()
    } catch (error) {
        res.status(404).send(error)
    }
}

