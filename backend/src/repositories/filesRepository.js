import { databaseEnabled, pool } from '../config/db.js';

const publicFields = (alias = '') => {
  const prefix = alias ? `${alias}.` : '';
  return `${prefix}id, ${prefix}file_name AS "fileName", ${prefix}original_name AS "originalName", ${prefix}mime_type AS "mimeType", ${prefix}file_size AS "fileSize", ${prefix}storage_path AS "storagePath", ${prefix}uploaded_by AS "uploadedBy", ${prefix}created_at AS "createdAt"`;
};

export async function bootstrapFiles() {
  if (!databaseEnabled) return;
  await pool.query(`CREATE TABLE IF NOT EXISTS lesson_files (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(120) NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
  // Compatibilidade com instalações anteriores que armazenavam URL pública.
  await pool.query('ALTER TABLE lesson_files ADD COLUMN IF NOT EXISTS public_url TEXT');
  await pool.query('ALTER TABLE lesson_files ALTER COLUMN public_url DROP NOT NULL');
}

export async function lessonByCode(code) {
  const { rows } = await pool.query('SELECT id, code FROM lessons WHERE code=$1', [code]);
  return rows[0] || null;
}

export async function createFile(file) {
  const { rows } = await pool.query(
    `INSERT INTO lesson_files (lesson_id, file_name, original_name, mime_type, file_size, storage_path, uploaded_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING ${publicFields()}`,
    [file.lessonId, file.fileName, file.originalName, file.mimeType, file.fileSize, file.storagePath, file.uploadedBy],
  );
  return rows[0];
}

export async function listFiles(code) {
  const { rows } = await pool.query(
    `SELECT ${publicFields('f')} FROM lesson_files f JOIN lessons l ON l.id=f.lesson_id WHERE l.code=$1 ORDER BY f.created_at DESC`,
    [code],
  );
  return rows;
}

export async function findFile(id) {
  const { rows } = await pool.query(`SELECT ${publicFields()} FROM lesson_files WHERE id=$1`, [id]);
  return rows[0] || null;
}

export async function deleteFile(id) {
  const { rowCount } = await pool.query('DELETE FROM lesson_files WHERE id=$1', [id]);
  return rowCount > 0;
}
