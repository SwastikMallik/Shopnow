const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : String,
    emailid : String,
    password : String,
    terms : Boolean
})

module.exports = mongoose.model("User", userSchema)