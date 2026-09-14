const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentación',
      version: '1.0.0',
      description: 'Documentación de mi API de Usuarios',
    },
    servers: [
      {
        url: 'https://gestion-de-usuarios-cpt6.onrender.com',
        description: 'Servidor de Producción (Render)'
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local (Desarrollo)'
      }
    ],
  },
  apis: ['./server.js'], // Archivo donde están definidas tus rutas
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
};

module.exports = { swaggerDocs };