import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db.js";
import { requireAuth, onlySupervisor } from "./auth.js";

const app = express();
app.use(cors());
app.use(express.json());

const TASK_SELECT = `SELECT t.*, creator.full_name AS creator_name, assignee.full_name AS assigned_name
  FROM tasks t JOIN users creator ON creator.id=t.created_by
  LEFT JOIN users assignee ON assignee.id=t.assigned_to`;

function cleanLocation(body) {
  const latitude =
    body.latitude === null ||
    body.latitude === undefined ||
    body.latitude === ""
      ? null
      : Number(body.latitude);
  const longitude =
    body.longitude === null ||
    body.longitude === undefined ||
    body.longitude === ""
      ? null
      : Number(body.longitude);
  const accuracy =
    body.locationAccuracy === null ||
    body.locationAccuracy === undefined ||
    body.locationAccuracy === ""
      ? null
      : Number(body.locationAccuracy);
  if ((latitude === null) !== (longitude === null))
    throw new Error("Latitud y longitud deben enviarse juntas.");
  if (
    latitude !== null &&
    (!Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180)
  )
    throw new Error("Las coordenadas no son válidas.");
  return {
    latitude,
    longitude,
    accuracy,
    capturedAt: body.locationCapturedAt
      ? new Date(body.locationCapturedAt)
      : null,
    address: body.locationAddress?.trim() || null,
  };
}

app.get("/api/health", async (_req, res) => {
  await db.query("SELECT 1");
  res.json({ ok: true });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query(
    "SELECT id, full_name, email, password_hash, role FROM users WHERE email=?",
    [email],
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password || "", user.password_hash)))
    return res.status(401).json({ message: "Email o contraseña incorrectos." });
  const safeUser = {
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(
    safeUser,
    process.env.JWT_SECRET || "dev_secret_change_me",
    { expiresIn: "8h" },
  );
  res.json({ token, user: safeUser });
});

app.get("/api/users/technicians", requireAuth, async (_req, res) => {
  const [rows] = await db.query(
    "SELECT id, full_name, email FROM users WHERE role='TECHNICIAN' ORDER BY full_name",
  );
  res.json(rows);
});

app.get("/api/tasks", requireAuth, async (req, res) => {
  const scope = req.query.scope || "mine";
  let where = "";
  let params = [];
  if (req.user.role === "TECHNICIAN" && scope === "available") {
    where = " WHERE t.assigned_to IS NULL AND t.status='OPEN'";
  } else if (req.user.role === "TECHNICIAN") {
    where = " WHERE t.assigned_to=?";
    params = [req.user.id];
  }
  const [rows] = await db.query(
    `${TASK_SELECT}${where} ORDER BY t.updated_at DESC`,
    params,
  );
  res.json(rows);
});

app.get("/api/tasks/map", requireAuth, async (_req, res) => {
  const [rows] = await db.query(
    `${TASK_SELECT} WHERE t.latitude IS NOT NULL AND t.longitude IS NOT NULL AND t.status <> 'CLOSED' ORDER BY t.updated_at DESC`,
  );
  res.json(rows);
});

app.get("/api/tasks/:id", requireAuth, async (req, res) => {
  const [rows] = await db.query(`${TASK_SELECT} WHERE t.id=?`, [req.params.id]);
  if (!rows[0])
    return res.status(404).json({ message: "Tarea no encontrada." });
  const task = rows[0];
  if (
    req.user.role === "TECHNICIAN" &&
    task.assigned_to !== req.user.id &&
    task.assigned_to !== null
  )
    return res.status(403).json({ message: "No podés consultar esta tarea." });
  res.json(task);
});

app.post("/api/tasks", requireAuth, onlySupervisor, async (req, res) => {
  try {
    const {
      title,
      description = "",
      assignedTo = null,
      status = "OPEN",
    } = req.body;
    if (!title?.trim())
      return res.status(400).json({ message: "El título es obligatorio." });
    const p = cleanLocation(req.body);
    const actualStatus = assignedTo
      ? status === "OPEN"
        ? "ASSIGNED"
        : status
      : "OPEN";
    const [result] = await db.query(
      `INSERT INTO tasks (title,description,status,created_by,assigned_to,latitude,longitude,location_accuracy,location_captured_at,location_address) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        title.trim(),
        description.trim(),
        actualStatus,
        req.user.id,
        assignedTo || null,
        p.latitude,
        p.longitude,
        p.accuracy,
        p.capturedAt,
        p.address,
      ],
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/tasks/:id", requireAuth, async (req, res) => {
  const [rows] = await db.query("SELECT * FROM tasks WHERE id=?", [
    req.params.id,
  ]);
  const task = rows[0];
  if (!task) return res.status(404).json({ message: "Tarea no encontrada." });
  const owns = task.assigned_to === req.user.id;
  if (req.user.role !== "SUPERVISOR" && !owns)
    return res.status(403).json({ message: "No podés editar esta tarea." });
  try {
    const p = cleanLocation(req.body);
    const title = req.body.title?.trim();
    if (!title)
      return res.status(400).json({ message: "El título es obligatorio." });
    const assignedTo =
      req.user.role === "SUPERVISOR"
        ? req.body.assignedTo || null
        : task.assigned_to;
    const status =
      req.user.role === "SUPERVISOR"
        ? req.body.status || task.status
        : req.body.status || task.status;
    await db.query(
      `UPDATE tasks SET title=?,description=?,status=?,assigned_to=?,latitude=?,longitude=?,location_accuracy=?,location_captured_at=?,location_address=? WHERE id=?`,
      [
        title,
        req.body.description?.trim() || "",
        assignedTo ? (status === "OPEN" ? "ASSIGNED" : status) : "OPEN",
        assignedTo,
        p.latitude,
        p.longitude,
        p.accuracy,
        p.capturedAt,
        p.address,
        task.id,
      ],
    );
    res.json({ message: "Tarea actualizada." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/api/tasks/:id/take", requireAuth, async (req, res) => {
  if (req.user.role !== "TECHNICIAN")
    return res
      .status(403)
      .json({ message: "Solo un técnico puede tomar una tarea." });
  const [result] = await db.query(
    "UPDATE tasks SET assigned_to=?,status='IN_PROGRESS' WHERE id=? AND assigned_to IS NULL AND status='OPEN'",
    [req.user.id, req.params.id],
  );
  if (!result.affectedRows)
    return res
      .status(409)
      .json({ message: "La tarea ya fue tomada o no está disponible." });
  res.json({ message: "Tarea asignada a tu usuario." });
});

app.post("/api/tasks/:id/release", requireAuth, async (req, res) => {
  const [result] = await db.query(
    "UPDATE tasks SET assigned_to=NULL,status='OPEN' WHERE id=? AND (assigned_to=? OR ?='SUPERVISOR')",
    [req.params.id, req.user.id, req.user.role],
  );
  if (!result.affectedRows)
    return res.status(403).json({ message: "No podés liberar esta tarea." });
  res.json({ message: "Tarea liberada." });
});

app.delete("/api/tasks/:id", requireAuth, onlySupervisor, async (req, res) => {
  const [result] = await db.query("DELETE FROM tasks WHERE id=?", [
    req.params.id,
  ]);
  if (!result.affectedRows)
    return res.status(404).json({ message: "Tarea no encontrada." });
  res.status(204).end();
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor." });
});
app.listen(process.env.PORT || 4000, () =>
  console.log(`SIGMA API en puerto ${process.env.PORT || 4000}`),
);
