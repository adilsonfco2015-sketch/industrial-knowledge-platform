import {
  create,
  destroy,
  findAll,
  update,
} from '../repositories/lessonsRepository.js';

const requiredFields = ['title', 'sector'];

function validateLesson(lesson) {
  const missing = requiredFields.filter((field) => !lesson[field]?.trim());
  return missing.length ? `Campos obrigatórios: ${missing.join(', ')}` : null;
}

export async function getLessons(_req, res, next) {
  try {
    res.json(await findAll());
  } catch (error) {
    next(error);
  }
}

export async function createLesson(req, res, next) {
  const validationError = validateLesson(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    res.status(201).json(await create(req.body));
  } catch (error) {
    next(error);
  }
}

export async function updateLesson(req, res, next) {
  const validationError = validateLesson(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const lesson = await update(req.params.id, req.body);
    if (!lesson) return res.status(404).json({ message: 'Lição não encontrada.' });
    res.json(lesson);
  } catch (error) {
    next(error);
  }
}

export async function deleteLesson(req, res, next) {
  try {
    const deleted = await destroy(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Lição não encontrada.' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
