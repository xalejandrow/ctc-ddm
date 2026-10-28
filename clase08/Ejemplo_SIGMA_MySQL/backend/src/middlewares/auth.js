import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'solo-para-desarrollo-local';

export function requireAuth(req, res, next) {
  const [type, token] = req.headers.authorization?.split(' ') ?? [];

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token de acceso requerido.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o vencido.' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
    }
    return next();
  };
}
