// routes/productRoutes.js
const express = require('express');
const { getProducts, createProduct, updateProduct, getProductById, deleteProduct, uploadProductsFromJson, categoriesFromProducts } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const router = express.Router();

// Configurar Multer para subir archivos
const upload = multer({ dest: 'uploads/' }); // Subirá los archivos a la carpeta 'uploads'

// Ruta para obtener categorías únicas
router.get('/categories', categoriesFromProducts)

// Rutas de productos
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID del producto
 *                   name:
 *                     type: string
 *                     description: Nombre del producto
 *                   price:
 *                     type: number
 *                     description: Precio del producto
 *                   description:
 *                     type: string
 *                     description: Descripción del producto
 *                   stock:
 *                     type: number
 *                     description: Cantidad en stock
 *                   category:
 *                     type: string
 *                     description: Categoría del producto
 *                   imageUrl:
 *                     type: string
 *                     description: URL de la imagen del producto
 *   post:
 *     summary: Crear un nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               stock:
 *                 type: number
 *                 description: Cantidad en stock
 *                 example: 10
 *               category:
 *                 type: string
 *                 description: Categoría del producto
 *               imageUrl:
 *                 type: string
 *                 description: URL de la imagen del producto
 *     responses:
 *       201:
 *         description: Producto creado
 *       401:
 *         description: No autorizado
 */
router.route('/')
    .post(protect, createProduct)
    .get(getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *               price:
 *                 type: number
 *                 description: Precio del producto
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *               stock:
 *                 type: number
 *                 description: Cantidad en stock
 *               category:
 *                 type: string
 *                 description: Categoría del producto
 *               imageUrl:
 *                 type: string
 *                 description: URL de la imagen del producto
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: Producto no encontrado
 * 
 *   get:
 *     summary: Obtener un producto por ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID del producto
 *                 name:
 *                   type: string
 *                   description: Nombre del producto
 *                 price:
 *                   type: number
 *                   description: Precio del producto
 *                 description:
 *                   type: string
 *                   description: Descripción del producto
 *                 stock:
 *                   type: number
 *                   description: Cantidad en stock
 *                 category:
 *                   type: string
 *                   description: Categoría del producto
 *                 imageUrl:
 *                   type: string
 *                   description: URL de la imagen del producto
 *       404:
 *         description: Producto no encontrado
 * 
 *   delete:
 *     summary: Eliminar un producto existente
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Producto eliminado
 *       404:
 *         description: Producto no encontrado
 */
router.route('/:id')
    .put(protect, updateProduct)
    .get(protect, getProductById)
    .delete(protect, deleteProduct);

router.post('/upload-json', upload.single('file'), uploadProductsFromJson);
  

module.exports = router;


