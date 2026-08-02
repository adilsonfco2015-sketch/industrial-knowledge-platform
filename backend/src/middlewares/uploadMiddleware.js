import multer from 'multer';
import path from 'path';

export const MAX_EVIDENCE_SIZE = 20 * 1024 * 1024;
export const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.docx', '.xlsx']);
const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

function isAllowed(file) {
  const extension = path.extname(file.originalname).toLowerCase();
  return allowedExtensions.has(extension) && allowedMimeTypes.has(file.mimetype);
}

export const uploadEvidence = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_EVIDENCE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!isAllowed(file)) {
      const error = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname);
      error.message = 'Formato não permitido. Envie JPG, PNG, WEBP, PDF, DOCX ou XLSX.';
      return callback(error);
    }
    return callback(null, true);
  },
}).single('file');
