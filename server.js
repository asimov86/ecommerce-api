// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerOptions');
//const path = require('path');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

// Habilitar CORS para permitir solicitudes desde el frontend en localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
// Servir archivos estáticos desde 'public'
//app.use(express.static(path.join(__dirname, 'public')));

// Cualquier ruta no especificada servirá el frontend
/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
}); */

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
