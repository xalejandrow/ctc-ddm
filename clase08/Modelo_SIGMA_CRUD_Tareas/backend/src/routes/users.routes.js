import { Router } from 'express';
import { pool } from '../config/database.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
const router = Router();
router.get('/technicians', requireAuth, requireRole('SUPERVISOR'), async (_req, res, next) => {
  try { const [rows] = await pool.execute("SELECT id, name, email FROM users WHERE role = 'TECNICO' ORDER BY name"); return res.json(rows); }
  catch (error) { next(error); }
});
export default router;
