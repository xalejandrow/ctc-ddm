import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { requireAuth } from '../middlewares/auth.js';
const router = Router();
const secret = process.env.JWT_SECRET ?? 'solo-desarrollo-local';

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password ?? '', user.password_hash))) return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, { expiresIn: '30m' });
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) { next(error); }
});
router.get('/me', requireAuth, async (req, res, next) => {
  try { const [rows] = await pool.execute('SELECT id, name, email, role FROM users WHERE id = ?', [req.user.sub]); return rows[0] ? res.json(rows[0]) : res.status(401).json({ message: 'Usuario no disponible.' }); }
  catch (error) { next(error); }
});
export default router;
