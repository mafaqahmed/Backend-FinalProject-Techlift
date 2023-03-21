const Product = require('../models/productModel')
require('express-async-errors')
const slugify = require('slugify')
const validateMongoDbId = require('../utils/validateMongoDbId')

const createProduct = async(req, res) => {
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }

}

const getaProduct = async(req, res) => {
    try {
        validateMongoDbId(req.params.id)
        const product = await Product.findById(req.params.id)
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
}

const getAllProducts = async(req, res) => {
    try {
        console.log(req.query)
        const queryObj = {...req.query};
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`)
        console.log(queryStr)
        let query = Product.find(JSON.parse(queryStr));

        //sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createdAt")
        }
        
        //Fielding
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ')
            query = query.select(fields)
        } else {
            query = query.select("-__v")
        }

        //Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        console.log(page, limit, skip)
        query = query.skip(skip).limit(limit)
        if(req.query.page) {
            let productsCount = await Product.countDocuments()
            if(skip >= productsCount) {
                throw new Error('This page does not exist')
            }
        }
        const products = await query
        res.json(products)
    } catch (error) {
        throw new Error(error)
    }
}

const updateProduct = async(req, res) => {
    try {
        validateMongoDbId(req.params.id)
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
}

const deleteProduct = async(req, res) => {
    validateMongoDbId(req.params.id)
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct}