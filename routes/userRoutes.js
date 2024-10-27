// routes/userRoutes.js
const express = require('express');
const { registerUser, authUser, changePassword, verifyUser, requestPasswordReset, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email', verifyUser);
router.put('/change-password', protect, changePassword);
router.post('/login', authUser);
router.post('/forgot-password', requestPasswordReset); // Solicitar restablecimiento
router.post('/reset-password', resetPassword); // Restablecer la contraseña con el token

module.exports = router;
