// routes/productRoutes.js
const express = require('express');
const { getProducts, createProduct, updateProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Rutas de productos
router.get('/', getProducts);
router.post('/', protect, createProduct);  // Solo usuarios autenticados pueden crear productos
router.route('/:id').put(updateProduct);

module.exports = router;


