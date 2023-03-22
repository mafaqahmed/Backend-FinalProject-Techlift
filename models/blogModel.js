const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isdisLiked:{
        type:Boolean,
        default:false,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    author: {
        type:String,
        default:'admin',
    },
    images: {
        type:String,
        default:'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmxvZ3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    }
},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true

    }
);

//Export the model
module.exports = mongoose.model('Blog', blogSchema);