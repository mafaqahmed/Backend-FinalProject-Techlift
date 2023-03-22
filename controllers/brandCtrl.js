const Brand = require("../models/brandModel");
require("express-async-errors");
const validateMongoDbId = require("../utils/validateMongoDbId");

const createBrand = async (req, res) => {
  try {
    let newBrand = await Brand(req.body);
    newBrand.save();
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id)
    let updatedBrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
};

const getBrand = async (req, res) => {
  try {
    const { id } = req.params;
    validateMongoDbId(id)
    let getBrand = await Brand.findById(id)
    res.json(getBrand);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBrands = async (req, res) => {
  try {
    const Brands = await Brand.find();
    res.json(Brands);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getAllBrands,
};
