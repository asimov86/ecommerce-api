// config/swaggerOptions.js
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Versión de OpenAPI
    info: {
      title: 'E-commerce API', // Título de tu API
      version: '1.0.0', // Versión de tu API
      description: 'Documentación de la API para el sistema de e-commerce.', // Descripción de tu API
    },
    components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer', 
            bearerFormat: 'JWT', // Especifica que el formato del token es JWT
          },
        },
      },
    security: [
        {
          bearerAuth: [], // Aplica el esquema de autenticación a todas las rutas que lo requieran
        },
      ],
    servers: [
      {
        url: 'http://localhost:5000', // URL base de tu API
      },
    ],
  },
  apis: ['routes/*.js'], // Ruta a los archivos donde se definen los endpoints
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
