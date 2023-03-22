const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    description:{
        type:String,
        required:true,
    },
    discount:{
        type:Boolean,
        required:true,
    },
    originalPrice:{
        type:Number,
        required:true,
    },
    discountedPrice:{
        type:Number,
    },
    category:{
        type:String,
        required:true,
        lowercase: true
    },
    // brand:{
    //     type:String,
    //     required:true,
    // },
    brand:{
        type:String,
        required: true,
        lowercase: true
    },
    quantity:{
        type:Number,
        required:true,
    },
    sold:{
        type:Number,
        default: 0,
        
    },
    images:{
        type:Array,
        default:[]
    },
    // color:[],
    color:{
        type:String,
        required: true,
        lowercase: true
    },
    tags: String,
    ratings: [
        {
            star: Number,
            comment: String,
            postedby: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    totalrating: {
        type: String,
        default: 0
    }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('product', userSchema);