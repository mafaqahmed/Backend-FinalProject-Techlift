const express = require('express');
const { createUser, loginUser, getAllUsers, getSingleUser, deleteUser, updateUser, blockuser, unblockuser, handleRefreshToken, handleLogOut } = require('../controllers/userCtrl');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', handleLogOut)
router.get('/:id', authMiddleware, adminMiddleware, getSingleUser)
router.delete('/:id', deleteUser)
router.put('/edit-user', authMiddleware, updateUser)
router.put('/block-user/:id', authMiddleware, adminMiddleware, blockuser)
router.put('/unblock-user/:id', authMiddleware, adminMiddleware, unblockuser)

module.exports = router;