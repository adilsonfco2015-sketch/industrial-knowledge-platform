import { databaseEnabled, pool } from '../config/db.js';

const defaultImage = 'https://images.unsplash.com/photo-1567789884554-0b844b597180?q=80&w=1200&auto=format&fit=crop';

let lessons = [
  { id: 'LA-001', title: 'Mancha fosca na peça', sector: 'Pintura', status: 'Resolvido', description: 'Peça apresentou perda de brilho após aplicação da tinta.', image: 'https://images.unsplash.com/photo-1581093458791-9d09f1f5b5be?q=80&w=1200&auto=format&fit=crop', cause: 'Pressão baixa na bomba', action: 'Ajuste do regulador de pressão', responsible: 'Carlos Henrique', date: '14/05/2026', attachment: '' },
  { id: 'LA-002', title: 'Diferença de tonalidade', sector: 'Laboratório de Cor', status: 'Em análise', description: 'Diferença visual entre lote piloto e lote produção.', image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop', cause: 'Falha na calibração do equipamento', action: 'Recalibrar o colorímetro', responsible: 'Fernanda Souza', date: '15/05/2026', attachment: '' },
];

function normalize(input, id) {
  return {
    id,
    title: input.title.trim(), sector: input.sector.trim(),
    description: input.description?.trim() ?? '', cause: input.cause?.trim() ?? '',
    action: input.action?.trim() ?? '', responsible: input.responsible?.trim() ?? '',
    status: input.status || 'Em análise', image: input.image || defaultImage,
    attachment: input.attachment || '', date: input.date || new Date().toLocaleDateString('pt-BR'),
  };
}

export async function findAll() {
  if (!databaseEnabled) return lessons;
  const { rows } = await pool.query('SELECT id, code AS "id", title, sector, description, cause, action, responsible, status, image_url AS image, created_at AS "createdAt" FROM lessons ORDER BY created_at DESC');
  return rows;
}

export async function create(input) {
  if (!databaseEnabled) {
    const lesson = normalize(input, `LA-${String(lessons.length + 1).padStart(3, '0')}`);
    lessons = [lesson, ...lessons];
    return lesson;
  }
  const code = `LA-${Date.now()}`;
  const lesson = normalize(input, code);
  const { rows } = await pool.query(
    'INSERT INTO lessons (code, title, sector, description, cause, action, responsible, status, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING code AS "id", title, sector, description, cause, action, responsible, status, image_url AS image, created_at AS "createdAt"',
    [lesson.id, lesson.title, lesson.sector, lesson.description, lesson.cause, lesson.action, lesson.responsible, lesson.status, lesson.image],
  );
  return rows[0];
}

export async function update(id, input) {
  if (!databaseEnabled) {
    const index = lessons.findIndex((lesson) => lesson.id === id);
    if (index < 0) return null;
    const lesson = normalize(input, id);
    lessons[index] = lesson;
    return lesson;
  }
  const lesson = normalize(input, id);
  const { rows } = await pool.query(
    'UPDATE lessons SET title=$2, sector=$3, description=$4, cause=$5, action=$6, responsible=$7, status=$8, image_url=$9, updated_at=CURRENT_TIMESTAMP WHERE code=$1 RETURNING code AS "id", title, sector, description, cause, action, responsible, status, image_url AS image, created_at AS "createdAt"',
    [id, lesson.title, lesson.sector, lesson.description, lesson.cause, lesson.action, lesson.responsible, lesson.status, lesson.image],
  );
  return rows[0] || null;
}

export async function destroy(id) {
  if (!databaseEnabled) {
    const count = lessons.length;
    lessons = lessons.filter((lesson) => lesson.id !== id);
    return lessons.length !== count;
  }
  const { rowCount } = await pool.query('DELETE FROM lessons WHERE code=$1', [id]);
  return rowCount > 0;
}
