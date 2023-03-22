const Category = require("../models/blogcategoryModel");
const User = require("../models/userModel");
require("express-async-errors");
const validateMongoDbId = require("../utils/validateMongoDbId");

const createCategory = async (req, res) => {
  try {
    let newCategory = await Category(req.body);
    newCategory.save();
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id)
    let updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id)
    let getCategory = await Category.findById(id)
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const Categorys = await Category.find();
    res.json(Categorys);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getAllCategories,
};
