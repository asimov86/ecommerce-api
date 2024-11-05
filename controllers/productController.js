// controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// Obtener todos los productos
  const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

// Crear un nuevo producto
  const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;
  const product = new Product({ name, description, price, stock, category, imageUrl });
  
  const savedProduct = await product.save();
  res.status(201).json(savedProduct);
});

// Actualizar un producto
  const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, category, imageUrl } = req.body;

  // Buscar el producto por ID
  const product = await Product.findById(req.params.id);

  if (product) {
    // Actualizar solo los campos que se han proporcionado
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (category !== undefined) product.category = category;

    // Guardar el producto actualizado
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// Exportar las funciones
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
};
