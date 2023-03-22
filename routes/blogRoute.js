const express = require('express');
const {createBlog, updateBlog, deleteBlog, getBlog, getAllBlogs, likeBlog, dislikeBlog, uploadImage} = require('../controllers/blogCtrl');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.put('/likes', authMiddleware, likeBlog)
router.put(
    "/upload/:id",
    authMiddleware,
    adminMiddleware,
    uploadPhoto.array("images", 10),
    blogImgResize,
    uploadImage
  );
router.put('/dislikes', authMiddleware, dislikeBlog)
router.post('/', authMiddleware, adminMiddleware, createBlog)
router.put('/:id', authMiddleware, adminMiddleware, updateBlog)
router.delete('/:id', authMiddleware, adminMiddleware, deleteBlog)
router.get('/:id', getBlog)
router.get('/', getAllBlogs)

module.exports = router