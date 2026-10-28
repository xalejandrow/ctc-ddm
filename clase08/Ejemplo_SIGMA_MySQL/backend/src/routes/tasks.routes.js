import { Router } from 'express';
import { pool } from '../config/database.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    // Regla de autorización adicional: el técnico solo ve sus propias tareas.
    const query = req.user.role === 'TECNICO'
      ? 'SELECT id, title, status, assigned_to AS assignedTo FROM tasks WHERE assigned_to = ? ORDER BY id DESC'
      : 'SELECT id, title, status, assigned_to AS assignedTo FROM tasks ORDER BY id DESC';
    const values = req.user.role === 'TECNICO' ? [req.user.sub] : [];
    const [tasks] = await pool.execute(query, values);
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
});

router.patch('/:id/assign', requireAuth, requireRole('SUPERVISOR'), async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const { tecnicoId } = req.body ?? {};

    const [technicians] = await pool.execute(
      "SELECT id FROM users WHERE id = ? AND role = 'TECNICO'",
      [tecnicoId],
    );
    if (!technicians[0]) return res.status(422).json({ message: 'El técnico indicado no existe.' });

    const [result] = await pool.execute('UPDATE tasks SET assigned_to = ? WHERE id = ?', [tecnicoId, taskId]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada.' });

    const [rows] = await pool.execute(
      'SELECT id, title, status, assigned_to AS assignedTo FROM tasks WHERE id = ?',
      [taskId],
    );
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
});

export default router;
