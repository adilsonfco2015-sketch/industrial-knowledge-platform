import path from 'path';
import { databaseEnabled } from '../config/db.js';
import { evidenceBucket, storageEnabled, supabase } from '../config/supabase.js';
import { createFile, deleteFile, findFile, lessonByCode, listFiles } from '../repositories/filesRepository.js';

function unavailable(res) { return res.status(503).json({ message: 'O módulo de anexos requer DATABASE_URL, SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.' }); }
function safeName(name) { return path.basename(name).replace(/[^a-zA-Z0-9._-]/g, '-'); }

export async function uploadFile(req, res, next) {
  if (!databaseEnabled || !storageEnabled) return unavailable(res);
  if (!req.file) return res.status(400).json({ message: 'Envie um arquivo permitido de até 20 MB.' });
  try { const lesson = await lessonByCode(req.params.id); if (!lesson) return res.status(404).json({ message: 'Lição não encontrada.' }); const fileName = `${Date.now()}-${crypto.randomUUID()}-${safeName(req.file.originalname)}`; const storagePath = `lessons/${lesson.code}/${fileName}`; const { error } = await supabase.storage.from(evidenceBucket).upload(storagePath, req.file.buffer, { contentType: req.file.mimetype, upsert: false }); if (error) throw error; const { data } = supabase.storage.from(evidenceBucket).getPublicUrl(storagePath); const file = await createFile({ lessonId: lesson.id, fileName, originalName: req.file.originalname, mimeType: req.file.mimetype, fileSize: req.file.size, storagePath, publicUrl: data.publicUrl, uploadedBy: req.user.sub }); return res.status(201).json(file); } catch (error) { return next(error); }
}
export async function getFiles(req, res, next) { if (!databaseEnabled || !storageEnabled) return unavailable(res); try { return res.json(await listFiles(req.params.id)); } catch (error) { return next(error); } }
export async function removeFile(req, res, next) { if (!databaseEnabled || !storageEnabled) return unavailable(res); try { const file = await findFile(req.params.id); if (!file) return res.status(404).json({ message: 'Arquivo não encontrado.' }); if (req.user.role !== 'Administrador' && file.uploadedBy !== req.user.sub) return res.status(403).json({ message: 'Você não tem permissão para excluir este arquivo.' }); const { error } = await supabase.storage.from(evidenceBucket).remove([file.storagePath]); if (error) throw error; await deleteFile(file.id); return res.status(204).send(); } catch (error) { return next(error); } }
