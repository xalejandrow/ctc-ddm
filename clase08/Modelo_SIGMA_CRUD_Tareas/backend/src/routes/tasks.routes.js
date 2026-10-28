import { Router } from 'express';
import { pool } from '../config/database.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
const router = Router();
const baseSelect = `SELECT t.id, t.title, t.description, t.status, t.assigned_to AS assignedTo, u.name AS technicianName FROM tasks t LEFT JOIN users u ON u.id = t.assigned_to`;
const validStatuses = ['ABIERTA', 'EN_PROCESO', 'FINALIZADA'];

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const isTechnician = req.user.role === 'TECNICO';
    const query = isTechnician ? `${baseSelect} WHERE t.assigned_to IS NULL OR t.assigned_to = ? ORDER BY t.id DESC` : `${baseSelect} ORDER BY t.id DESC`;
    const [rows] = await pool.execute(query, isTechnician ? [req.user.sub] : []);
    res.json(rows);
  } catch (error) { next(error); }
});

router.post('/', requireAuth, requireRole('SUPERVISOR'), async (req, res, next) => {
  try {
    const { title, description = '', status = 'ABIERTA', assignedTo = null } = req.body ?? {};
    if (!title?.trim()) return res.status(422).json({ message: 'El título es obligatorio.' });
    if (!validStatuses.includes(status)) return res.status(422).json({ message: 'Estado inválido.' });
    const [result] = await pool.execute('INSERT INTO tasks (title, description, status, assigned_to) VALUES (?, ?, ?, ?)', [title.trim(), description, status, assignedTo || null]);
    const [rows] = await pool.execute(`${baseSelect} WHERE t.id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) { next(error); }
});

router.patch('/:id/claim', requireAuth, requireRole('TECNICO'), async (req, res, next) => {
  try {
    const [result] = await pool.execute("UPDATE tasks SET assigned_to = ?, status = 'EN_PROCESO' WHERE id = ? AND assigned_to IS NULL AND status <> 'FINALIZADA'", [req.user.sub, req.params.id]);
    if (!result.affectedRows) return res.status(409).json({ message: 'La tarea ya fue tomada, finalizada o no existe.' });
    const [rows] = await pool.execute(`${baseSelect} WHERE t.id = ?`, [req.params.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.patch('/:id/release', requireAuth, requireRole('TECNICO'), async (req, res, next) => {
  try {
    const [result] = await pool.execute("UPDATE tasks SET assigned_to = NULL, status = 'ABIERTA' WHERE id = ? AND assigned_to = ?", [req.params.id, req.user.sub]);
    if (!result.affectedRows) return res.status(403).json({ message: 'Solo puedes liberar una tarea que te pertenece.' });
    const [rows] = await pool.execute(`${baseSelect} WHERE t.id = ?`, [req.params.id]);
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const taskId = Number(req.params.id);
    const { title, description = '', status = 'ABIERTA', assignedTo = null } = req.body ?? {};
    if (!title?.trim() || !validStatuses.includes(status)) return res.status(422).json({ message: 'Título o estado inválido.' });
    if (req.user.role === 'SUPERVISOR') {
      const [result] = await pool.execute('UPDATE tasks SET title = ?, description = ?, status = ?, assigned_to = ? WHERE id = ?', [title.trim(), description, status, assignedTo || null, taskId]);
      if (!result.affectedRows) return res.status(404).json({ message: 'Tarea no encontrada.' });
    } else {
      const [result] = await pool.execute('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND assigned_to = ?', [title.trim(), description, status, taskId, req.user.sub]);
      if (!result.affectedRows) return res.status(403).json({ message: 'Solo puedes editar tareas asignadas a tu usuario.' });
    }
    const [rows] = await pool.execute(`${baseSelect} WHERE t.id = ?`, [taskId]);
    res.json(rows[0]);
  } catch (error) { next(error); }
});

router.delete('/:id', requireAuth, requireRole('SUPERVISOR'), async (req, res, next) => {
  try { const [result] = await pool.execute('DELETE FROM tasks WHERE id = ?', [req.params.id]); return result.affectedRows ? res.status(204).send() : res.status(404).json({ message: 'Tarea no encontrada.' }); }
  catch (error) { next(error); }
});
export default router;
