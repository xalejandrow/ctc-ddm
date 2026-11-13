import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Falta el token de acceso." });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me");
    next();
  } catch {
    res.status(401).json({ message: "El token no es válido o venció." });
  }
}

export function onlySupervisor(req, res, next) {
  if (req.user.role !== "SUPERVISOR") return res.status(403).json({ message: "Solo un supervisor puede realizar esta acción." });
  next();
}
