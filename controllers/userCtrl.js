const userModel = require("../models/userModel");
require("express-async-errors");
const {generateToken} = require('../config/jwToken');
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require('jsonwebtoken')
const env = require('dotenv').config()

const createUser = async (req, res) => {
  let email = req.body.email;
  let findUser = await userModel.findOne({ email: email });

  if (!findUser) {
    let newUser = await userModel.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already exists");
  }
};
const loginUser = async (req, res) => {
  let { email, password } = req.body;
  let findUser = await userModel.findOne({ email: email });

  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser._id)
    const updateUser = await userModel.findByIdAndUpdate(findUser._id, {
      refreshToken: refreshToken
    }, {new: true})
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    })
    res.json({
      id: findUser._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
};
const handleRefreshToken = async(req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) throw new Error('No refresh token is available in request header')
  const user = await userModel.findOne({refreshToken})
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if(err || user._id != decoded.id) throw new Error('Something wrong with the refresh token')
    const accessToken = generateToken(decoded.id)
    res.json({accessToken})
  })
}
const handleLogOut = async(req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) throw new Error('No refresh token is available in request header')
  const user = await userModel.findOne({refreshToken})
  if(!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true
    })
    return res.sendStatus(204) //forbidden
  }
  await userModel.findOneAndUpdate(refreshToken, {
    refreshToken: '',
  })
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true
  })
  res.sendStatus(204) //forbidden
}
const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    res.json(users)
  } catch (error) {
    throw new Error(error)
  }
};
const getSingleUser = async (req, res) => {
  const {id} = req.params
  validateMongoDbId(id)
  try {
    let user = await userModel.findById(id);
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
};
const deleteUser = async (req, res) => {
  const {id} = req.params
  validateMongoDbId(id)
  try {
    let user = await userModel.findByIdAndDelete(id);
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
};
const updateUser = async (req, res) => {
  const {_id} = req.user
  validateMongoDbId(_id)
  try {
    let user = await userModel.findByIdAndUpdate(_id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      }, {
        new: true
      });
    res.json(user)
  } catch (error) {
    throw new Error(error)
  }
};
const blockuser = async(req, res) => {
  try {
    const {id} = req.params;
    validateMongoDbId(id)
    const blockUser = await userModel.findByIdAndUpdate(id,{
      isBlocked: true,
    },{
      new: true
    })
    res.json({
      message:'User is blocked'})
  } catch (error) {
    throw new Error(error)
  }
}
const unblockuser = async(req, res) => {
  try {
    const {id} = req.params;
    validateMongoDbId(id)
    const unblockUser = await userModel.findByIdAndUpdate(id,{
      isBlocked: false,
    },{
      new: true
    })
    res.json({
      message:'User is unblocked'})
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = { createUser, loginUser, getAllUsers, getSingleUser, deleteUser, updateUser, blockuser, unblockuser, handleRefreshToken, handleLogOut };
