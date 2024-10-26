// routes/orderRoutes.js
const express = require('express');
const { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, addOrderItems); // Crear una orden
router.get('/:id', protect, getOrderById); // Obtener una orden por ID
router.put('/:id/pay', protect, updateOrderToPaid); // Actualizar el estado de pago
router.get('/myorders', protect, getMyOrders); // Obtener las órdenes del usuario autenticado

module.exports = router;
