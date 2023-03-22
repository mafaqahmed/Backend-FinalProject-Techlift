const express = require('express');
const { createUser, loginUser, getAllUsers, getSingleUser, deleteUser, updateUser, blockuser, unblockuser, handleRefreshToken, handleLogOut, updatePassword, forgotPassword, resetPasword, loginAdmin } = require('../controllers/userCtrl');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.post('/admin-login', loginAdmin)
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', handleLogOut)
router.get('/:id', authMiddleware, adminMiddleware, getSingleUser)
router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateUser)
router.put('/password', authMiddleware, updatePassword)
router.put('/block-user/:id', authMiddleware, adminMiddleware, blockuser)
router.put('/unblock-user/:id', authMiddleware, adminMiddleware, unblockuser)
router.put('/forgot-password', forgotPassword)
router.put('/reset-password/:token', resetPasword)

module.exports = router;