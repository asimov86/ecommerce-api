const express = require('express');
const { addToCart, getCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const { getCartItems } = require('../controllers/cartController');

const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove', protect, removeFromCart);
router.get('/cart', protect, getCartItems);

module.exports = router;
