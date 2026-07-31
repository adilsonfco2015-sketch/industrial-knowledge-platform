import { Router } from 'express';
import { getFiles, removeFile, uploadFile } from '../controllers/filesController.js';
import { authenticateJWT } from '../middlewares/authMiddleware.js';
import { uploadEvidence } from '../middlewares/uploadMiddleware.js';

const lessonFilesRouter = Router();
lessonFilesRouter.post('/:id/files', uploadEvidence, uploadFile);
lessonFilesRouter.get('/:id/files', getFiles);
const filesRouter = Router();
filesRouter.delete('/:id', authenticateJWT, removeFile);
export { lessonFilesRouter, filesRouter };
