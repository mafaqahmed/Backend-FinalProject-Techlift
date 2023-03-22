const userModel = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
require("express-async-errors");
const uniqid = require("uniqid");
const { generateToken } = require("../config/jwToken");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const env = require("dotenv").config();

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
    const refreshToken = await generateRefreshToken(findUser._id);
    const updateUser = await userModel.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });
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
const loginAdmin = async (req, res) => {
  let { email, password } = req.body;
  let findAdmin = await userModel.findOne({ email: email });

  if (findAdmin.role !== "admin") throw new Error("Not Authorized");

  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin._id);
    const updateUser = await userModel.findByIdAndUpdate(
      findAdmin._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 1000,
    });
    res.json({
      id: findAdmin._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
};
const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    throw new Error("No refresh token is available in request header");
  const user = await userModel.findOne({ refreshToken });
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user._id != decoded.id)
      throw new Error("Something wrong with the refresh token");
    const accessToken = generateToken(decoded.id);
    res.json({ accessToken });
  });
};
const handleLogOut = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    throw new Error("No refresh token is available in request header");
  const user = await userModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }
  await userModel.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
};
const getAllUsers = async (req, res) => {
  try {
    let users = await userModel.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
};
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    let user = await userModel.findById(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
};
const deleteUser = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    let user = await userModel.findByIdAndDelete(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
};
const updateUser = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    let user = await userModel.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }
};
const blockuser = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const blockUser = await userModel.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User is blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
};
const unblockuser = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id);
    const unblockUser = await userModel.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User is unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await userModel.findById(_id);
    if (password) {
      user.password = password;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.find({ email });
  if (user) {
    try {
      const token = await userModel.createPasswordResetToken();
      await user.save();
      const resetUrl = `Hi, please follow this link to reset your password. The link is valid for 10 minutes only. <a href="http://localhost:5000/api/user/reset-password/${token}" target="_blank">Click here</a>`;
      // const data = {
      //   to: email,
      //   text: "Hey User",
      //   subject: "Forgot Password Link",
      //   htm: resetURL,
      // };
      // sendEmail(data);
      res.json(token);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("No user found");
  }
};

const resetPasword = async (req, res) => {
  const token = req.params.token;
  const password = req.body.password;
  const user = await userModel.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token is expired. Please try again");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
};

const getWishlist = async (req, res) => {
  try {
    const { _id } = req.user;
    let findUser = await userModel.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
};

const saveAddress = async (req, res) => {
  try {
    const { _id } = req.user;
    let findUser = await userModel.findByIdAndUpdate(
      _id,
      {
        address: req.body.address,
      },
      {
        new: true,
      }
    );
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
};

const userCart = async (req, res) => {
  try {
    let products = [];
    const { _id } = req.user;
    const { cart } = req.body;
    const alreadyExistCart = await Cart.findOne({ orderby: _id });
    if (alreadyExistCart) {
      alreadyExistCart.remove();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      const getPrice = await Product.findById(cart[i]._id)
        .select("price")
        .exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].count * products[i].price;
    }
    let newCart = await new Cart({ products, cartTotal, orderby: _id }).save();
    res.json(newCart)
  } catch (error) {
    throw new Error(error);
  }
};

const getUserCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
};

const emptyCart = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndRemove({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
};

const applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("Invalid Coupon");
  }
  const user = await User.findOne({ _id });
  let { cartTotal } = await Cart.findOne({
    orderby: user._id,
  }).populate("products.product");
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderby: user._id },
    { totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
};

const createOrder = async (req, res) => {
  const { COD, couponApplied } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    if (!COD) throw new Error("Create cash order failed");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderby: user._id });
    let finalAmout = 0;
    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmout = userCart.totalAfterDiscount;
    } else {
      finalAmout = userCart.cartTotal;
    }

    let newOrder = await new Order({
      products: userCart.products,
      paymentIntent: {
        id: uniqid(),
        method: "COD",
        amount: finalAmout,
        status: "Cash on Delivery",
        created: Date.now(),
        currency: "usd",
      },
      orderby: user._id,
      orderStatus: "Cash on Delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json({ message: "success" });
  } catch (error) {
    throw new Error(error);
  }
};

const getOrders = async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const userorders = await Order.findOne({ orderby: _id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const alluserorders = await Order.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
};

const getOrderByUserId = async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const userorders = await Order.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updateOrderStatus = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockuser,
  unblockuser,
  handleRefreshToken,
  handleLogOut,
  updatePassword,
  forgotPassword,
  resetPasword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  getAllOrders,
  getOrderByUserId,
  updateOrderStatus,
};
