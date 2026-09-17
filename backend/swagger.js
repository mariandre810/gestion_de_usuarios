import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestión de Usuarios',
      version: '1.0.0',
      description: 'Documentación de la API de usuarios',
    },
    servers: [
      {
        url: 'https://gestion-de-usuarios-cpt6.onrender.com',
        description: 'Servidor de Producción (Render)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./server.js'], // Lee las anotaciones de las rutas en server.js
};

const swaggerSpec = swaggerJSDoc(options);

// Exportación nombrada
export const swaggerDocs = (app, port) => {
  // Redirección de la raíz (/) a Swagger UI para evitar el "Cannot GET /"
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });

  // Configuración de la ruta para Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Documentación disponible en http://localhost:${port}/api-docs`);
};