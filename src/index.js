require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const usuariosRouter = require('./routes/usuarios.routes');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/saludo', (req, res) => {
  const nombre = (req.query.nombre || 'mundo').toString();
  res.json({ ok: true, mensaje: `Hola, ${nombre}!` });
});

app.get('/api/fecha', (_req, res) => {
  res.json({ ok: true, fechaISO: new Date().toISOString() });
});

app.use('/api/usuarios', usuariosRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), ts: Date.now() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en puerto ${PORT}`));
