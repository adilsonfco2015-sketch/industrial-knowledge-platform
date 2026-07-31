import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import lessonsRoutes from './routes/lessonsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import { filesRouter, lessonFilesRouter } from './routes/filesRoutes.js';
import { authenticateJWT } from './middlewares/authMiddleware.js';

const app = express();
const corsOptions = process.env.FRONTEND_URL ? { origin: process.env.FRONTEND_URL, methods: ['GET', 'POST', 'PUT', 'DELETE'] } : { origin: '*' };

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));
app.get('/', (_req, res) => res.json({ status: 'online', message: 'API Industrial Knowledge funcionando' }));
app.use('/api/auth', authRoutes);
app.use('/api/lessons', authenticateJWT, lessonsRoutes);
app.use('/api/lessons', authenticateJWT, lessonFilesRouter);
app.use('/api/files', filesRouter);
app.use('/api/users', usersRoutes);
app.use((error, _req, res, _next) => { if (error.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'O arquivo excede o limite de 20 MB.' }); console.error(error); return res.status(500).json({ message: 'Erro interno do servidor.' }); });

export default app;
