import { Router } from 'express';
import { getUsers, postUser, putUser, removeUser } from '../controllers/usersController.js';
import { authenticateJWT, authorizeRoles } from '../middlewares/authMiddleware.js';
const router = Router();
router.use(authenticateJWT, authorizeRoles('Administrador'));
router.get('/', getUsers); router.post('/', postUser); router.put('/:id', putUser); router.delete('/:id', removeUser);
export default router;
