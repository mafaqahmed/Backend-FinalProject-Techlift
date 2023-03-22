const Product = require("../models/productModel");
require("express-async-errors");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongoDbId");
const userModel = require("../models/userModel");

const createProduct = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
};

const getaProduct = async (req, res) => {
  try {
    validateMongoDbId(req.params.id);
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    console.log(req.query);
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, (match) => `$${match}`);
    console.log(queryStr);
    let query = Product.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Fielding
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    console.log(page, limit, skip);
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      let productsCount = await Product.countDocuments();
      if (skip >= productsCount) {
        throw new Error("This page does not exist");
      }
    }
    const products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    validateMongoDbId(req.params.id);
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProduct = async (req, res) => {
  validateMongoDbId(req.params.id);
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
};

const addToWishList = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prodId } = req.body;
    let user = await userModel.findById(userId);
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === prodId.toString()
    );
    if (alreadyAdded) {
      let user = await userModel.findByIdAndUpdate(
        userId,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await userModel.findByIdAndUpdate(
        userId,
        {
          $push: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const ratings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { prodId, star, comment } = req.body;
    let product = await Product.findById(prodId);
    const alreadyRated = await product.ratings.find(
      (rating) => rating.postedby.toString() === userId.toString()
    );
    if (alreadyRated) {
      const updatedProduct = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const updatedProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: { star: star, comment: comment, postedby: userId },
          },
        },
        {
          new: true,
        }
      );
    }

    const getAllRatings = await Product.findById(prodId);
    let totalratings = getAllRatings.ratings.length;
    let ratingsum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalratings);
    const finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      {
        new: true,
      }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  ratings,
};
