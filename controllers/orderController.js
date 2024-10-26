// controllers/orderController.js
const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
// Importar el modelo del carrito
const Cart = require('../models/cartModel');

// @desc Crear una nueva orden
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
  // Obtener el ID del usuario desde el middleware protect
  const userId = req.user._id; 
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No hay artículos en la orden');
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    const createdOrder = await order.save();

    // Limpiar el carrito del usuario
    await Cart.findOneAndDelete({ userId: userId });
    
    res.status(201).json(createdOrder);
  }
});

// @desc Obtener una orden por ID
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Orden no encontrada');
  }
});

// @desc Actualizar el estado de pago de una orden
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Orden no encontrada');
  }
});

// @desc Obtener órdenes del usuario autenticado
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders
};
