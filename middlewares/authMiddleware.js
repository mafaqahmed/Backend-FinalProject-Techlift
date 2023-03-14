require('express-async-errors')
const jwt = require('jsonwebtoken')
const env = require('dotenv').config()
const User = require('../models/userModel')
const authMiddleware = async(req, res, next) => {
    let token;
    if (req?.headers?.authorization?.startsWith("Bearer")){
        token = req?.headers?.authorization?.split(' ')[1];
        try {
            if(token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id)
                req.user = user;
                next();
            }
        } catch (error) {
            throw new Error('Token is expired or invalid')
        }
    } else {
        throw new Error("No token is attached to the request")
    }
}

const adminMiddleware = async(req, res, next) => {
    const user = req.user;

    if(user.role !== 'admin') {
        throw new Error('You are not an admin')
    } else{
        next();
    }
}

module.exports = {authMiddleware, adminMiddleware}