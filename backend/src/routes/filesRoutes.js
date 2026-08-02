import { Router } from 'express';
import { downloadFile, getFiles, removeFile, uploadFile } from '../controllers/filesController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { uploadEvidence } from '../middlewares/uploadMiddleware.js';

const lessonFilesRouter = Router();
lessonFilesRouter.post('/:id/files', uploadEvidence, uploadFile);
lessonFilesRouter.get('/:id/files', getFiles);

const filesRouter = Router();
filesRouter.get('/:id/download', authenticateJWT, downloadFile);
filesRouter.delete('/:id', authenticateJWT, removeFile);

export { lessonFilesRouter, filesRouter };
