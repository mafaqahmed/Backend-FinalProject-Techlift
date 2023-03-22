const express = require('express');
const {createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCoupon} = require('../controllers/couponCtrl');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createCoupon)
router.get('/', authMiddleware, adminMiddleware, getAllCoupons)
router.get('/:id', authMiddleware, adminMiddleware, getCoupon)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCoupon)
router.put('/:id', authMiddleware, adminMiddleware, updateCoupon)

module.exports = router