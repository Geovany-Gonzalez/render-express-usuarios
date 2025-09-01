const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET /api/usuarios
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id_usuario, nombre, correo, fecha_reg FROM usuarios ORDER BY id_usuario'
    );
    res.json({ ok: true, data: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Error al listar usuarios' });
  }
});

// GET /api/usuarios/:id
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id_usuario, nombre, correo, fecha_reg FROM usuarios WHERE id_usuario = $1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: 'No encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Error al obtener usuario' });
  }
});

// POST /api/usuarios
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ ok: false, error: 'nombre, correo y password son obligatorios' });
    }
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password)
       VALUES ($1, $2, $3)
       RETURNING id_usuario, nombre, correo, fecha_reg`,
      [nombre, correo, password]
    );
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ ok: false, error: 'Correo ya registrado' });
    console.error(e);
    res.status(500).json({ ok: false, error: 'Error al crear usuario' });
  }
});

// PUT /api/usuarios/:id
router.put('/:id', async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;
    const { rows } = await pool.query(
      `UPDATE usuarios SET
         nombre   = COALESCE($1, nombre),
         correo   = COALESCE($2, correo),
         password = COALESCE($3, password)
       WHERE id_usuario = $4
       RETURNING id_usuario, nombre, correo, fecha_reg`,
      [nombre ?? null, correo ?? null, password ?? null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: 'No encontrado' });
    res.json({ ok: true, data: rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ ok: false, error: 'Correo ya registrado' });
    console.error(e);
    res.status(500).json({ ok: false, error: 'Error al actualizar' });
  }
});

// DELETE /api/usuarios/:id
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id_usuario = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ ok: false, error: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Error al eliminar' });
  }
});

module.exports = router;
