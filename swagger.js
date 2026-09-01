import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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
        url: 'http://localhost:3000', // Cambia el puerto si utilizas otro distinto
      },
    ],
  },
  apis: ['./server.js'], // Archivo donde están definidas tus rutas
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app, port) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
};