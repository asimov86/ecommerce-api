const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Función para agregar un producto al carrito
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id; // Obtenemos el ID del usuario logueado

  // Verificar si el usuario ya tiene un carrito
  let cart = await Cart.findOne({ userId });

  // Si no existe el carrito, creamos uno y actualizamos el usuario
  if (!cart) {
    cart = await Cart.create({ userId, products: [] });
    await User.findByIdAndUpdate(userId, { cartId: cart._id }); // Guardar la referencia del carrito en el usuario
  }

  // Buscar el producto en la base de datos
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  // Buscar si el producto ya está en el carrito
  const existingProductIndex = cart.products.findIndex(item => item.productId.equals(productId));

  if (existingProductIndex >= 0) {
    // Actualizar la cantidad si el producto ya existe en el carrito
    cart.products[existingProductIndex].quantity += quantity;
  } else {
    // Agregar el nuevo producto al carrito
    cart.products.push({
      productId: product._id,
      imageUrl: product.imageUrl,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  // Validar stock
  if (product.stock < quantity) {
    return res.status(400).json({ message: 'No hay suficiente stock para agregar al carrito' });
  }

  // Actualizar el stock del producto
  product.stock -= quantity; // Restar la cantidad del stock
  await product.save(); // Guardar el producto actualizado

  // Guardar el carrito actualizado en la base de datos
  await cart.save();
  res.status(200).json(cart);
});

// Función para eliminar un producto del carrito
  const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Obtener ID del usuario desde el middleware protect
  const { productId } = req.body; // Asumimos que recibirás el ID del producto a eliminar

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: 'El carrito no existe' });
  }

  // Verificar si products está definido
  if (!cart.products) {
    return res.status(400).json({ message: 'El carrito no tiene productos' });
  }

  // Filtrar los productos para eliminar el que coincide con productId
  cart.products = cart.products.filter(item => item.productId.toString() !== productId);
  
  await cart.save();
  res.status(200).json(cart);
});

// Función para obtener el carrito del usuario
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Obtener el ID del usuario desde el middleware protect

  // Buscar el carrito del usuario
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: 'El carrito no existe' });
  }

  // Devolver el carrito encontrado
  res.status(200).json(cart);
});

  // Función para actualizar la cantidad de un producto en el carrito
const updateCartItem = async (req, res) => {
  const userId = req.user._id; // Obtener ID del usuario desde el middleware protect
  const { productId, quantity } = req.body; // Obtener el ID del producto y la nueva cantidad del body

  try {

    // Buscar el producto en la base de datos
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Buscar el carrito del usuario
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'El carrito no existe' });
    }

    // Buscar el producto en el carrito
    const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'El producto no se encuentra en el carrito' });
    }

    // Validar stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'No hay suficiente stock para agregar al carrito' });
    }

    // Actualizar la cantidad del producto
    cart.products[productIndex].quantity = quantity;

    await cart.save(); // Guardar los cambios en el carrito

    // Actualizar el stock del producto
    product.stock -= quantity; // Restar la cantidad del stock
    await product.save(); // Guardar el producto actualizado

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la cantidad del producto en el carrito', error });
  }
};

const getCartItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('cart.items.product'); // Asumiendo que el carrito tiene una relación con productos

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado.' });
    return;
  }

  res.status(200).json({ cart: user.cart });
});



// Exports
module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItem,
  getCartItems
  // Aquí se puede agregar más funciones relacionadas al carrito.
};
