import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { pool } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import tasksRoutes from "./routes/tasks.routes.js";
import usersRoutes from "./routes/users.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", async (_req, res, next) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});
app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes);
app.use("/users", usersRoutes);
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.code === "LIMIT_FILE_SIZE")
    return res
      .status(413)
      .json({ message: "La imagen supera el límite de 6 MB." });
  if (error instanceof multer.MulterError)
    return res
      .status(422)
      .json({ message: "No se pudo procesar el archivo enviado." });
  res.status(500).json({ message: "Error interno del servidor." });
});
app.listen(Number(process.env.PORT ?? 4000), () =>
  console.log("API SIGMA CRUD en http://localhost:4000"),
);
