import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET ?? 'solo-desarrollo-local';
export function requireAuth(req, res, next) {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];
  if (type !== 'Bearer' || !token) return res.status(401).json({ message: 'Token de acceso requerido.' });
  try { req.user = jwt.verify(token, secret); return next(); }
  catch { return res.status(401).json({ message: 'Token inválido o vencido.' }); }
}
export function requireRole(...roles) { return (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'No tienes permiso para esta acción.' }); }
