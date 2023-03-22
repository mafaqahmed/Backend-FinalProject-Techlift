const express = require('express');
const { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct, addToWishList, ratings } = require('../controllers/productCtrl');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.put('/wishlist', authMiddleware, addToWishList)
router.put('/rating', authMiddleware, ratings)
router.post('/', authMiddleware, adminMiddleware, createProduct)
router.get('/:id', getaProduct)
router.get('/', getAllProducts)
router.put('/:id', authMiddleware, adminMiddleware, updateProduct)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct)

module.exports = router;