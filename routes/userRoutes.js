// routes/userRoutes.js
const express = require('express');
const { registerUser, authUser } = require('../controllers/userController');
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', authUser);

module.exports = router;
