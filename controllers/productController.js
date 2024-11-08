// controllers/productController.js
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const fs = require('fs');

// Obtener todos los productos
//   const getProducts = asyncHandler(async (req, res) => {
//   const products = await Product.find();
//   res.status(200).json(products);
// });

const getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;  // Página actual, por defecto es 1
    const limit = parseInt(req.query.limit) || 10;  // Productos por página, por defecto es 10
    const skip = (page - 1) * limit;

    // Obtener productos con paginación
    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    // Obtener el total de productos para calcular el total de páginas
    const totalProducts = await Product.countDocuments();

    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;  // Si la página actual es menor que el total, hay más páginas
    const hasPrevPage = page > 1;  // Si la página actual es mayor a 1, hay una página anterior

    const nextPage = hasNextPage ? page + 1 : null;  // Página siguiente, si existe
    const prevPage = hasPrevPage ? page - 1 : null;  // Página anterior, si existe

    res.status(200).json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage
    });
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

  const deleteProduct = asyncHandler(async (req, res) => {

    const deleteProduct = await Product.deleteOne({_id:req.params.id});

    if (deleteProduct.deleteCount === 0) {
      res.status(404);
      throw new Error('Product no encontrado');
    }
    res.status(204).send();
  });

  const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product){
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(product);

  });

  // Controlador para cargar el archivo JSON y agregar productos a la base de datos
const uploadProductsFromJson = asyncHandler(async (req, res) => {
    const filePath = req.file.path; // Ruta temporal del archivo subido
    const fileData = fs.readFileSync(filePath, 'utf8'); // Leer el archivo
    const products = JSON.parse(fileData); // Parsear el archivo JSON

    // Insertar productos en la base de datos
    const createdProducts = await Product.insertMany(products);

    // Eliminar el archivo temporal después de procesarlo
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: `${createdProducts.length} productos agregados exitosamente.`,
      products: createdProducts,
    });
});

// Exportar las funciones
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  uploadProductsFromJson
};
