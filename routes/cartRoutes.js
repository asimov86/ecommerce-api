const express = require('express');
const { addToCart, getCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { getCartItems } = require('../controllers/cartController');

const router = express.Router();

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Agregar un producto al carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a agregar
 *                 example: "60d0fe4f5311236168a109ca"
 *               quantity:
 *                 type: integer
 *                 description: Cantidad del producto
 *                 example: 2
 *     responses:
 *       201:
 *         description: Producto agregado al carrito
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/add', protect, addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener el carrito del usuario autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     responses:
 *       200:
 *         description: Carrito obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                         description: ID del producto
 *                       quantity:
 *                         type: integer
 *                         description: Cantidad del producto
 *       401:
 *         description: Falta de autenticación
 */
router.get('/', protect, getCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Actualizar un producto en el carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a actualizar
 *               quantity:
 *                 type: integer
 *                 description: Nueva cantidad del producto
 *     responses:
 *       200:
 *         description: Producto actualizado en el carrito
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Producto no encontrado en el carrito
 */
router.put('/update', protect, updateCartItem);

/**
 * @swagger
 * /api/cart/remove:
 *   delete:
 *     summary: Eliminar un producto del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a eliminar
 *                 example: "60d0fe4f5311236168a109ca"
 *     responses:
 *       204:
 *         description: Producto eliminado del carrito
 *       404:
 *         description: Producto no encontrado en el carrito
 */
router.delete('/remove', protect, removeFromCart);

/**
 * @swagger
 * /api/cart/cart:
 *   get:
 *     summary: Obtener los artículos del carrito
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     responses:
 *       200:
 *         description: Artículos del carrito obtenidos con éxito
 *       401:
 *         description: Falta de autenticación
 */
router.get('/cart', protect, getCartItems);

module.exports = router;
