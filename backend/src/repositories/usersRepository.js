import bcrypt from 'bcryptjs';
import { databaseEnabled, pool } from '../config/db.js';

let memoryUsers = [];
const publicFields = 'id, name AS "name", email, role, active, created_at AS "createdAt", updated_at AS "updatedAt"';

function normalize(input) {
  return { name: String(input.name || '').trim(), email: String(input.email || '').trim().toLowerCase(), role: input.role || 'Colaborador', active: input.active !== false };
}

export async function bootstrapUsers() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_INITIAL_PASSWORD || 'Admin@123', 12);
  if (!databaseEnabled) {
    if (!memoryUsers.length) memoryUsers = [{ id: 1, name: 'Administrador', email: 'admin@empresa.com', passwordHash, role: 'Administrador', active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }];
    return;
  }
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'Colaborador',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  await pool.query('INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING', ['Administrador', 'admin@empresa.com', passwordHash, 'Administrador']);
}

export async function findByEmail(email) {
  if (!databaseEnabled) return memoryUsers.find((user) => user.email === email) || null;
  const { rows } = await pool.query(`SELECT ${publicFields}, password_hash AS "passwordHash" FROM users WHERE email=$1`, [email]);
  return rows[0] || null;
}

export async function findById(id) {
  if (!databaseEnabled) return memoryUsers.find((user) => user.id === Number(id)) || null;
  const { rows } = await pool.query(`SELECT ${publicFields} FROM users WHERE id=$1`, [id]);
  return rows[0] || null;
}

export async function listUsers() {
  if (!databaseEnabled) return memoryUsers.map(({ passwordHash, ...user }) => user);
  const { rows } = await pool.query(`SELECT ${publicFields} FROM users ORDER BY name`);
  return rows;
}

export async function createUser(input) {
  const user = normalize(input); const passwordHash = await bcrypt.hash(input.password, 12);
  if (!databaseEnabled) {
    if (memoryUsers.some((item) => item.email === user.email)) { const error = new Error('E-mail já cadastrado.'); error.code = '23505'; throw error; }
    const created = { id: (memoryUsers.at(-1)?.id || 0) + 1, ...user, passwordHash, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; memoryUsers.push(created); const { passwordHash: _hash, ...publicUser } = created; return publicUser;
  }
  const { rows } = await pool.query(`INSERT INTO users (name, email, password_hash, role, active) VALUES ($1,$2,$3,$4,$5) RETURNING ${publicFields}`, [user.name, user.email, passwordHash, user.role, user.active]); return rows[0];
}

export async function updateUser(id, input) {
  const user = normalize(input); const passwordHash = input.password ? await bcrypt.hash(input.password, 12) : null;
  if (!databaseEnabled) {
    const index = memoryUsers.findIndex((item) => item.id === Number(id)); if (index < 0) return null;
    if (memoryUsers.some((item) => item.email === user.email && item.id !== Number(id))) { const error = new Error('E-mail já cadastrado.'); error.code = '23505'; throw error; }
    memoryUsers[index] = { ...memoryUsers[index], ...user, ...(passwordHash ? { passwordHash } : {}), updatedAt: new Date().toISOString() }; const { passwordHash: _hash, ...publicUser } = memoryUsers[index]; return publicUser;
  }
  const { rows } = await pool.query(`UPDATE users SET name=$2, email=$3, role=$4, active=$5, password_hash=COALESCE($6, password_hash), updated_at=CURRENT_TIMESTAMP WHERE id=$1 RETURNING ${publicFields}`, [id, user.name, user.email, user.role, user.active, passwordHash]); return rows[0] || null;
}

export async function deleteUser(id) {
  if (!databaseEnabled) { const count = memoryUsers.length; memoryUsers = memoryUsers.filter((user) => user.id !== Number(id)); return count !== memoryUsers.length; }
  const { rowCount } = await pool.query('DELETE FROM users WHERE id=$1', [id]); return rowCount > 0;
}
