const express = require('express');
const { registerUser, authUser, changePassword, verifyUser, requestPasswordReset, resetPassword, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de usuario
 *                 example: Pedro Pérez
 *               email:
 *                 type: string
 *                 description: Correo de usuario
 *                 example: pperez@pepito.com
 *               password:
 *                 type: string
 *                 description: Contraseña de usuario
 *                 example: p23242pik
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: El usuario ya existe o datos de usuario inválidos
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/users/verify:
 *   get:
 *     summary: Verificar la cuenta del usuario a través del enlace enviado al correo
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token de verificación enviado al correo electrónico del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cuenta verificada con éxito
 *       400:
 *         description: Token inválido o cuenta ya verificada
 */
router.get('/verify', verifyUser);


/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: Cambiar la contraseña del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Contraseña actual del usuario
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Contraseña actualizada con éxito
 *       401:
 *         description: Contraseña actual incorrecta o falta de autenticación
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/change-password', protect, changePassword);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Iniciar sesión de un usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *                 example: pperez@pepito.com
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *                 example: p23242pik
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT de autenticación del usuario
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Credenciales inválidas o datos incorrectos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Descripción del error
 *                   example: "Correo electrónico o contraseña incorrectos"
 *       401:
 *         description: La cuenta no está activa (no verificada)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Explicación del problema
 *                   example: "Por favor, verifica tu correo para activar tu cuenta."
 */
router.post('/login', authUser);

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Solicitar un restablecimiento de contraseña
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo enviado para restablecer la contraseña
 *       404:
 *         description: Usuario no encontrado
 */
router.post('/forgot-password', requestPasswordReset); // Solicitar restablecimiento

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Restablecer la contraseña usando el token
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         description: Token de autenticación enviado por correo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida con éxito
 *       400:
 *         description: Token inválido o datos de entrada inválidos
 */
router.post('/reset-password', resetPassword); // Restablecer la contraseña con el token

router.get('/profile', protect, getUserProfile);

module.exports = router;
