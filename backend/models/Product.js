const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    pname: String,
    category : String,
    quantity : Number,
    price: Number
})

module.exports = mongoose.model('Products', productSchema)