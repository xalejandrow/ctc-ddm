import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'solo-para-desarrollo-local';

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(422).json({ message: 'Correo y contraseña son obligatorios.' });
    }

    const [rows] = await pool.execute(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [email],
    );
    const user = rows[0];
    const passwordIsValid = user && await bcrypt.compare(password, user.password_hash);

    if (!passwordIsValid) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30m' },
    );

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', 
  requireAuth, 
  async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [req.user.sub],
    );
    if (!rows[0]) return res.status(401).json({ message: 'Usuario no disponible.' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

export default router;
