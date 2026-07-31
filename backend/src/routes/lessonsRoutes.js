import { Router } from 'express';
import {
  createLesson,
  deleteLesson,
  getLessons,
  updateLesson,
} from '../controllers/lessonsController.js';

const router = Router();

router.get('/', getLessons);
router.post('/', createLesson);
router.put('/:id', updateLesson);
router.delete('/:id', deleteLesson);

export default router;
