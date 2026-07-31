import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/auth.js';

export function authenticateJWT(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Autenticação obrigatória.' });
  try { req.user = jwt.verify(token, jwtSecret()); return next(); } catch { return res.status(401).json({ message: 'Sessão inválida ou expirada.' }); }
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => allowedRoles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Você não tem permissão para esta ação.' });
}
