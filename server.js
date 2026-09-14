import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import { swaggerDocs } from './swagger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_fallback';

// Configuración de CORS permitiendo peticiones desde Angular
// Configuración de CORS flexible para desarrollo y producción
const allowedDomains = [
  'https://gestion-de-usuarios.onrender.com',
  'https://venerable-horse-cf8bf6.netlify.app' // Sin el /login al final
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite peticiones sin origen (Postman/Swagger) o desde localhost o dominios permitidos
    if (!origin || origin.startsWith('http://localhost:') || allowedDomains.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false); // Retorna false para denegar limpiamente
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Se incluye OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// 1. Obtener todos los usuarios
/**
 * @openapi
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags:
 *       - Usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       404:
 *         description: No se encontraron datos
 */
app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios ORDER BY id ASC');
    if (rows.length === 0) {
      return res.status(404).json({ message: "No Data Found" });
    }
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Buscar usuario por username
/**
 * @openapi
 * /api/usuarios/{username}:
 *   get:
 *     summary: Buscar usuario por username
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: No encontrado
 */
app.get('/api/usuarios/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username.trim()]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Crear nuevo usuario (Registro solo con username y password)
/**
 * @openapi
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: mariandre
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Campos faltantes o nombre de usuario existente
 *       500:
 *         description: Error interno del servidor
 */
app.post('/api/usuarios', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "El usuario y la contraseña son requeridos." });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (username, password) VALUES (?, ?)',
      [username.trim(), password.trim()]
    );

    res.status(201).json({
      message: "Usuario creado exitosamente.",
      id: result.insertId,
      user: {
        id: result.insertId,
        username: username.trim()
      }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }
    res.status(500).json({ message: error.message });
  }
});

// 4. Endpoint de Login (Valida credenciales y genera sesión con JWT)
/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: mariandre
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login exitoso y entrega de token JWT
 *       401:
 *         description: Credenciales incorrectas
 *       500:
 *         description: Error de servidor
 */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Se requieren nombre de usuario y contraseña" });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE username = ? AND password = ?', 
      [username.trim(), password.trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    const usuario = rows[0];

    const payload = {
      id: usuario.id,
      username: usuario.username
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });

    res.json({
      message: "Inicio de sesión exitoso",
      token: token,
      user: {
        id: usuario.id,
        username: usuario.username
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor y desplegar Swagger
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  swaggerDocs(app, PORT);
});