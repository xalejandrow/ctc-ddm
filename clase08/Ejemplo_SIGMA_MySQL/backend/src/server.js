import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { pool } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import tasksRoutes from './routes/tasks.routes.js';

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get('/health', async (_req, res, next) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ ok: true, database: 'connected' });
  } catch (error) {
    return next(error);
  }
});

app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor.' });
});

app.listen(PORT, () => console.log(`API disponible en http://localhost:${PORT}`));
