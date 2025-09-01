require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const usuariosRouter = require('./routes/usuarios.routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// 🔹 Ruta raíz con "mini documentación"
app.get('/', (_req, res) => {
  res.json({
    name: 'API Usuarios',
    status: 'ok',
    docs: {
      health: '/api/health',
      saludo: '/api/saludo?nombre=TuNombre',
      fecha: '/api/fecha',
      usuarios: {
        listar: 'GET /api/usuarios',
        obtener: 'GET /api/usuarios/:id',
        crear: 'POST /api/usuarios',
        actualizar: 'PUT /api/usuarios/:id',
        eliminar: 'DELETE /api/usuarios/:id'
      }
    }
  });
});

// 🔹 Endpoint de prueba simple
app.get('/api/saludo', (req, res) => {
  const nombre = (req.query.nombre || 'mundo').toString();
  res.json({ ok: true, mensaje: `Hola, ${nombre}!` });
});

// 🔹 Endpoint que devuelve fecha/hora del sistema
app.get('/api/fecha', (_req, res) => {
  res.json({ ok: true, fechaISO: new Date().toISOString() });
});

// 🔹 CRUD usuarios
app.use('/api/usuarios', usuariosRouter);

// 🔹 Healthcheck para verificar el servicio
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), ts: Date.now() });
});

// 🔹 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
