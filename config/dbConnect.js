const mongoose = require('mongoose');
const env = require('dotenv').config();

const dbConnect = () => {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/Ecommerce-db')
        console.log('DB connection established')
    } catch (error) {
        console.log('DB connection error')
    }
}

module.exports = dbConnect;