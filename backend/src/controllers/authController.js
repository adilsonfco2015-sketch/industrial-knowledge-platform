import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/auth.js';
import { findByEmail, findById } from '../repositories/usersRepository.js';

function publicUser(user) { const { passwordHash, ...safeUser } = user; return safeUser; }
function tokenFor(user) { return jwt.sign({ sub: user.id, name: user.name, email: user.email, role: user.role }, jwtSecret(), { expiresIn: '8h' }); }

export async function login(req, res, next) {
  const email = String(req.body.email || '').trim().toLowerCase(); const password = String(req.body.password || '');
  if (!email || !password) return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
  try { const user = await findByEmail(email); if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'E-mail ou senha inválidos.' }); return res.json({ token: tokenFor(user), user: publicUser(user) }); } catch (error) { return next(error); }
}
export async function me(req, res, next) { try { const user = await findById(req.user.sub); if (!user || !user.active) return res.status(401).json({ message: 'Usuário não está ativo.' }); return res.json({ user: publicUser(user) }); } catch (error) { return next(error); } }
export function logout(_req, res) { return res.status(204).send(); }
