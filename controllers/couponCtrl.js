const Coupon = require('../models/couponModel')
require("express-async-errors");

const createCoupon = async(req, res) => {
    try {
        const newCoupon = await Coupon(req.body);
        newCoupon.save();
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error)
    }
}

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons)
    } catch (error) {
        throw new Error(error)
    }
}

const updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {new:true});
        res.json(updatedCoupon)
    } catch (error) {
        throw new Error(error)
    }
}

const deleteCoupon = async (req, res) => {
    try {
        const deleteCoupon = await Coupon.findByIdAndDelete(req.params.id);
        res.json(deleteCoupon)
    } catch (error) {
        throw new Error(error)
    }
}

const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        res.json(delecouponteCoupon)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCoupon}