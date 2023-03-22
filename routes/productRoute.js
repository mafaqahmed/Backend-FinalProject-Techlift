const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  ratings,
  uploadImage,
} = require("../controllers/productCtrl");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");
const {
  uploadPhoto,
  productImgResize,
} = require("../middlewares/uploadImages");

const router = express.Router();

router.put("/wishlist", authMiddleware, addToWishList);
router.put(
  "/upload/:id",
  authMiddleware,
  adminMiddleware,
  uploadPhoto.array("images", 10),
  productImgResize,
  uploadImage
);
router.put("/rating", authMiddleware, ratings);
router.post("/", authMiddleware, adminMiddleware, createProduct);
router.get("/:id", getaProduct);
router.get("/", getAllProducts);
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
