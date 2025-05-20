const jwt = require('jsonwebtoken')
const { getToken } = require('../service/auth')

const authenticationToken = (req, res, next) => {
    const token = req.cookies.jwt_token

    if(!token){
        return res.status(401).json({message: 'Access denied. Token missing'})
    }
    try {
        const verifyToken = getToken(token)
        req.user = verifyToken; 
        next()
    } catch(error){
        return res.status(401).json({message: `Invalid or expired token: ${error}`})
    }
}

module.exports = authenticationToken