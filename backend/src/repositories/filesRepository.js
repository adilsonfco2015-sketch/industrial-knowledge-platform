import { databaseEnabled, pool } from '../config/db.js';

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
    public_url TEXT NOT NULL,
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
}

export async function lessonByCode(code) {
  if (!databaseEnabled) return null;
  const { rows } = await pool.query('SELECT id, code FROM lessons WHERE code=$1', [code]);
  return rows[0] || null;
}

export async function createFile(file) {
  const { rows } = await pool.query(`INSERT INTO lesson_files (lesson_id, file_name, original_name, mime_type, file_size, storage_path, public_url, uploaded_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, file_name AS "fileName", original_name AS "originalName", mime_type AS "mimeType", file_size AS "fileSize", storage_path AS "storagePath", public_url AS "publicUrl", uploaded_by AS "uploadedBy", created_at AS "createdAt"`, [file.lessonId, file.fileName, file.originalName, file.mimeType, file.fileSize, file.storagePath, file.publicUrl, file.uploadedBy]);
  return rows[0];
}

export async function listFiles(code) {
  const { rows } = await pool.query(`SELECT f.id, f.file_name AS "fileName", f.original_name AS "originalName", f.mime_type AS "mimeType", f.file_size AS "fileSize", f.storage_path AS "storagePath", f.public_url AS "publicUrl", f.uploaded_by AS "uploadedBy", f.created_at AS "createdAt" FROM lesson_files f JOIN lessons l ON l.id=f.lesson_id WHERE l.code=$1 ORDER BY f.created_at DESC`, [code]);
  return rows;
}

export async function findFile(id) {
  const { rows } = await pool.query(`SELECT f.id, f.storage_path AS "storagePath", f.uploaded_by AS "uploadedBy" FROM lesson_files f WHERE f.id=$1`, [id]);
  return rows[0] || null;
}

export async function deleteFile(id) { const { rowCount } = await pool.query('DELETE FROM lesson_files WHERE id=$1', [id]); return rowCount > 0; }
