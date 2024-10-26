const express = require('express');
const { addToCart, getCart, updateCartItem, removeFromCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
//router.put('/update', protect, updateCartItem);
router.delete('/remove', protect, removeFromCart);

module.exports = router;
