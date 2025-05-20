const jwt = require('jsonwebtoken')
const secretcode = process.env.JWT_SECRET_KEY

const setToken = (user_id) => {
    const token = jwt.sign({user_id}, secretcode, { expiresIn: '1h' })
    return token
}

const getToken = (token) => {
    if(!token) return null
    return jwt.verify(token, secretcode)
}

module.exports = {setToken, getToken}  //exporting the functions