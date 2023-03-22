const express = require('express');
const {createCategory, updateCategory, deleteCategory, getCategory, getAllCategories} = require('../controllers/blogcategoryCtrl');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createCategory)
router.put('/:id', authMiddleware, adminMiddleware, updateCategory)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory)
router.get('/:id', getCategory)
router.get('/', getAllCategories)

module.exports = router