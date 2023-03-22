const express = require('express');
const {createBrand, updateBrand, deleteBrand, getBrand, getAllBrands} = require('../controllers/brandCtrl');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createBrand)
router.put('/:id', authMiddleware, adminMiddleware, updateBrand)
router.delete('/:id', authMiddleware, adminMiddleware, deleteBrand)
router.get('/:id', getBrand)
router.get('/', getAllBrands)

module.exports = router