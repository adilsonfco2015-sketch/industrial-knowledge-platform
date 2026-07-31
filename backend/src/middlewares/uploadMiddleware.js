import multer from 'multer';
import path from 'path';

const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.docx', '.xlsx']);
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);

export const uploadEvidence = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 }, fileFilter: (_req, file, callback) => { const extension = path.extname(file.originalname).toLowerCase(); callback(null, allowedExtensions.has(extension) && allowedMimeTypes.has(file.mimetype)); } }).single('file');
