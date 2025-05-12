const express = require('express')

const router = express.Router()
const Product = require("../models/Product")

//Fetch all products
router
.route("/")
.get(async (req, res)=>{
    try {
        const products = await Product.find();
        res.status(200).json({
            success: true,
            data: products
        });
    } 
    catch (err) {
        res.status(500).json({ message: "Error getting products", error: err });
    }
})

//Add-Product
router
.route("/")
.post(async (req, res)=>{
    if(req.body != "undefined"){
            const result = await Product.insertOne(req.body)
            res.status(201).json({
                success : true,
                data : result
            })
        }
})

//Update Product
router
.route("/:id")
.put(async(req, res)=>{
    try{
        const filter = {_id:req.params.id}
        const updateDocument = {$set: req.body}
        const updateData = await Product.updateOne(filter, updateDocument)
        console.log(updateData)
        res.status(200).json({
            success : true,
            data: updateData
        })
    } catch(error){
        console.log(`Logs are: ${error}`)
        res.status(500).json({
            error: error 
        })
    }
})

//Fetch product by ID
router
.route("/:id")
.get(async (req, res)=>{
    try{
        const getProductById = await Product.findById(req.params.id)
        console.log(getProductById)
        if (!getProductById) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(getProductById)
    } catch(err){
        //console.log("000", err)
        res.status(500).json({ error: 'Server error' });
    }
})
module.exports = router