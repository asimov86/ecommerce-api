// routes/orderRoutes.js
const express = require('express');
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear una nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: ID del producto
 *                       example: "60d0fe4f5311236168a109ca"
 *                     qty:
 *                       type: integer
 *                       description: Cantidad del producto
 *                       example: 2
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                     description: Dirección de envío
 *                     example: "123 Calle Principal"
 *                   city:
 *                     type: string
 *                     description: Ciudad
 *                     example: "Madrid"
 *                   postalCode:
 *                     type: string
 *                     description: Código postal
 *                     example: "28001"
 *                   country:
 *                     type: string
 *                     description: País
 *                     example: "España"
 *     responses:
 *       201:
 *         description: Orden creada correctamente
 *       400:
 *         description: Datos de orden inválidos
 */
router.post('/', protect, addOrderItems); // Crear una orden

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener una orden por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                 shippingAddress:
 *                   type: object
 *                 totalPrice:
 *                   type: number
 *       404:
 *         description: Orden no encontrada
 */
router.get('/:id', protect, getOrderById); // Obtener una orden por ID

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Actualizar el estado de pago de una orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la orden a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPaid:
 *                 type: boolean
 *                 description: Estado de pago
 *                 example: true
 *               paidAt:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de pago
 *                 example: "2023-10-01T10:00:00Z"
 *     responses:
 *       200:
 *         description: Estado de pago actualizado
 *       404:
 *         description: Orden no encontrada
 */
router.put('/:id/pay', protect, updateOrderToPaid); // Actualizar el estado de pago

/**
 * @swagger
 * /api/orders/myorders:
 *   get:
 *     summary: Obtener las órdenes del usuario autenticado
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []  # Esto habilita la autenticación con Bearer Token
 *     responses:
 *       200:
 *         description: Lista de órdenes del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   orderItems:
 *                     type: array
 *                     items:
 *                       type: object
 *                   totalPrice:
 *                     type: number
 *       401:
 *         description: Falta de autenticación
 */
router.get('/myorders', protect, getMyOrders); // Obtener las órdenes del usuario autenticado

module.exports = router;
