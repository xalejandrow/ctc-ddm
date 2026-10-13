const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/sigma",
    // process.env.DATABASE_URL || "postgresql://sigma:sigma@localhost:5432/sigma",
});
async function init() {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS tasks (client_id TEXT PRIMARY KEY, title TEXT NOT NULL, status TEXT NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`,
  );
}
app.get("/api/tasks", async (_req, res) =>
  res.json(
    (
      await pool.query(
        'SELECT client_id AS id,title,status,updated_at AS "updatedAt" FROM tasks ORDER BY updated_at DESC',
      )
    ).rows,
  ),
);
app.post("/api/tasks", async (req, res) => {
  const { id, title, status } = req.body;
  if (!id || !title)
    return res.status(400).json({ message: "id y title son obligatorios" });
  const q = `INSERT INTO tasks (client_id,title,status,updated_at) VALUES ($1,$2,$3,NOW()) ON CONFLICT (client_id) DO UPDATE SET title=EXCLUDED.title,status=EXCLUDED.status,updated_at=NOW() RETURNING client_id AS id,title,status,updated_at AS "updatedAt"`;
  res
    .status(201)
    .json((await pool.query(q, [id, title, status || "PENDIENTE"])).rows[0]);
});
app.patch("/api/tasks/:id", async (req, res) => {
  const q = `UPDATE tasks SET title=$2,status=$3,updated_at=NOW() WHERE client_id=$1 RETURNING client_id AS id,title,status,updated_at AS "updatedAt"`;
  const r = await pool.query(q, [
    req.params.id,
    req.body.title,
    req.body.status,
  ]);
  if (!r.rowCount) return res.status(404).json({ message: "No encontrada" });
  res.json(r.rows[0]);
});
app.delete("/api/tasks/:id", async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE client_id=$1", [req.params.id]);
  res.status(204).end();
});
init()
  .then(() =>
    app.listen(3000, "0.0.0.0", () =>
      console.log("API SIGMA http://localhost:3000/api/tasks"),
    ),
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
