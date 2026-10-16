import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT ?? 4000);

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3307),
  database: process.env.DB_NAME ?? 'sigma',
  user: process.env.DB_USER ?? 'sigma',
  password: process.env.DB_PASSWORD ?? 'sigma',
  waitForConnections: true,
  connectionLimit: 10,
  timezone: 'Z',
});

app.use(cors());
app.use(express.json());

const toIso = (value) => (value instanceof Date ? value.toISOString() : value);
const taskDto = (task) => ({
  id: task.id,
  title: task.title,
  status: task.status,
  updatedAt: toIso(task.updated_at),
  deletedAt: task.deleted_at ? toIso(task.deleted_at) : null,
});

async function getAllTasks(connection = pool) {
  const [rows] = await connection.query(
    'SELECT id, title, status, updated_at, deleted_at FROM tasks ORDER BY updated_at DESC'
  );
  return rows.map(taskDto);
}

function validateTask(task) {
  if (!task?.id || !task?.title || !task?.updatedAt) {
    throw new Error('Cada tarea debe incluir id, title y updatedAt.');
  }
  if (!['PENDIENTE', 'FINALIZADA'].includes(task.status)) {
    throw new Error('El estado debe ser PENDIENTE o FINALIZADA.');
  }
}

async function upsertTask(connection, task) {
  validateTask(task);
  await connection.execute(
    `INSERT INTO tasks (id, title, status, updated_at, deleted_at)
     VALUES (?, ?, ?, ?, NULL)
     ON DUPLICATE KEY UPDATE
       title = IF(VALUES(updated_at) >= updated_at, VALUES(title), title),
       status = IF(VALUES(updated_at) >= updated_at, VALUES(status), status),
       deleted_at = IF(VALUES(updated_at) >= updated_at, NULL, deleted_at),
       updated_at = GREATEST(updated_at, VALUES(updated_at))`,
    [task.id, task.title.trim(), task.status, new Date(task.updatedAt)]
  );
}

async function deleteTask(connection, task) {
  if (!task?.id || !task?.updatedAt) {
    throw new Error('La eliminacion debe incluir id y updatedAt.');
  }
  await connection.execute(
    `UPDATE tasks
     SET deleted_at = IF(? >= updated_at, ?, deleted_at),
         updated_at = GREATEST(updated_at, ?)
     WHERE id = ?`,
    [new Date(task.updatedAt), new Date(task.updatedAt), new Date(task.updatedAt), task.id]
  );
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'mysql' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.get('/api/tasks', async (_req, res, next) => {
  try {
    res.json(await getAllTasks());
  } catch (error) {
    next(error);
  }
});

app.post('/api/tasks', async (req, res, next) => {
  try {
    await upsertTask(pool, req.body);
    res.status(201).json(req.body);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/tasks/:id', async (req, res, next) => {
  try {
    if (req.params.id !== req.body.id) throw new Error('El id de URL y cuerpo no coincide.');
    await upsertTask(pool, req.body);
    res.json(req.body);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    if (req.params.id !== req.body.id) throw new Error('El id de URL y cuerpo no coincide.');
    await deleteTask(pool, req.body);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.post('/api/sync', async (req, res, next) => {
  const operations = req.body?.operations;
  if (!Array.isArray(operations)) {
    return res.status(400).json({ message: 'operations debe ser un arreglo.' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const acknowledgements = [];
    for (const operation of operations) {
      if (!['CREATE', 'UPDATE', 'DELETE'].includes(operation.type)) {
        throw new Error(`Operacion no soportada: ${operation.type}`);
      }
      if (operation.type === 'DELETE') await deleteTask(connection, operation.task);
      else await upsertTask(connection, operation.task);
      acknowledgements.push({ queueId: operation.queueId, taskId: operation.task.id });
    }
    await connection.commit();
    res.json({ acknowledgements, tasks: await getAllTasks(connection) });
  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(400).json({ message: error.message ?? 'Error inesperado.' });
});

app.listen(port, () => console.log(`SIGMA API escuchando en http://localhost:${port}`));
