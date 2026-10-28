import "dotenv/config";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const JWT_SECRET = process.env.JWT_SECRET ?? "solo-para-desarrollo-local";

app.use(cors());
app.use(express.json());

// Base de usuarios ficticia. En un proyecto real: contraseña hasheada en una BD.
const users = [
  {
    id: 1,
    email: "tecnico@sigma.test",
    password: "123456",
    role: "TECNICO",
    name: "Técnico SIGMA",
  },
  {
    id: 2,
    email: "supervisor@sigma.test",
    password: "123456",
    role: "SUPERVISOR",
    name: "Supervisor SIGMA",
  },
];

const tasks = [
  { id: 1, title: "Revisar impresora", assignedTo: 1, status: "ABIERTA" },
  {
    id: 2,
    title: "Actualizar inventario",
    assignedTo: null,
    status: "ABIERTA",
  },
  {
    id: 3,
    title: "Revisar servidor",
    assignedTo: null,
    status: "ABIERTA",
  },
];

function createAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "30m" },
  );
}

// AUTENTICACIÓN: verifica el token antes de permitir una ruta protegida.
function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const [type, token] = authorization?.split(" ") ?? [];

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token de acceso requerido." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: "Token inválido o vencido." });
  }
}

// AUTORIZACIÓN POR ROL: solo los roles indicados pueden continuar.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para realizar esta acción." });
    }
    return next();
  };
}

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const user = users.find(
    (item) => item.email === email && item.password === password,
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "Correo o contraseña incorrectos." });
  }

  const token = createAccessToken(user);
  return res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name },
  });
});

app.get("/tasks",
   requireAuth, 
   (_req, res) => {
  return res.json(tasks);
});

// Solo SUPERVISOR puede asignar una tarea.
app.patch(
  "/tasks/:id/assign",
  requireAuth,
  requireRole("SUPERVISOR"),
  (req, res) => {
    const task = tasks.find((item) => item.id === Number(req.params.id));
    const { tecnicoId } = req.body ?? {};

    if (!task) return res.status(404).json({ message: "Tarea no encontrada." });
    if (
      !users.some((user) => user.id === tecnicoId && user.role === "TECNICO")
    ) {
      return res
        .status(422)
        .json({ message: "El técnico indicado no existe." });
    }

    task.assignedTo = tecnicoId;
    return res.json(task);
  },
);

app.listen(PORT, () => {
  console.log(`API SIGMA disponible en http://localhost:${PORT}`);
});
