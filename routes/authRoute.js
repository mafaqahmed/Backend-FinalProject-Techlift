const express = require("express");
const {
  createUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
  blockuser,
  unblockuser,
  handleRefreshToken,
  handleLogOut,
  updatePassword,
  forgotPassword,
  resetPasword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  emptyCart,
  getUserCart,
  applyCoupon,
  createOrder,
  getOrders,
  getAllOrders,
  getOrderByUserId,
  updateOrderStatus,
} = require("../controllers/userCtrl");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin-login", loginAdmin);
router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/logout", handleLogOut);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/addcart", authMiddleware, userCart);
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/getallorders", authMiddleware, authMiddleware, getAllOrders);
router.get("/getorderbyuser/:id", authMiddleware, authMiddleware, getOrderByUserId);
router.put("/update-order/:id", authMiddleware, authMiddleware, updateOrderStatus);
router.get("/getcart", authMiddleware, getUserCart);
router.get("/empty-cart", authMiddleware, emptyCart);
router.put("/save-address", authMiddleware, saveAddress);
router.get("/:id", authMiddleware, adminMiddleware, getSingleUser);
router.delete("/:id", deleteUser);
router.put("/edit-user", authMiddleware, updateUser);
router.put("/password", authMiddleware, updatePassword);
router.put("/block-user/:id", authMiddleware, adminMiddleware, blockuser);
router.put("/unblock-user/:id", authMiddleware, adminMiddleware, unblockuser);
router.put("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPasword);

module.exports = router;
