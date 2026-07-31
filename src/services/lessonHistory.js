const storageKey = 'industrial-knowledge-history';
const userName = 'Administrador Industrial';

function readHistory() { try { return JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { return {}; } }
function writeHistory(history) { localStorage.setItem(storageKey, JSON.stringify(history)); }
function fieldName(field) { return ({ title: 'Título', description: 'Descrição', cause: 'Causa raiz', action: 'Ação corretiva', status: 'Status', responsible: 'Responsável', containment: 'Contenção', correction: 'Correção', preventiveAction: 'Ação preventiva', conclusionDate: 'Data de conclusão' })[field] || field; }

export function getLessonHistory(lessonId) { return readHistory()[lessonId] || []; }
export function addHistoryEntry(lessonId, entry) { const history = readHistory(); const current = history[lessonId] || []; history[lessonId] = [{ id: `${Date.now()}-${Math.random()}`, user: userName, timestamp: new Date().toISOString(), ...entry }, ...current]; writeHistory(history); return history[lessonId]; }
export function registerCreation(lesson) { return addHistoryEntry(lesson.id, { action: 'Cadastrou a ocorrência', field: 'Registro', previousValue: '', newValue: lesson.title }); }
export function registerChanges(previous, next) { const fields = Object.keys(next).filter((field) => previous[field] !== next[field] && !['id', 'image', 'attachment', 'date'].includes(field)); if (!fields.length) return getLessonHistory(next.id); return fields.flatMap((field) => addHistoryEntry(next.id, { action: field === 'status' ? 'Alterou o status' : 'Atualizou', field: fieldName(field), previousValue: previous[field] || 'Não informado', newValue: next[field] || 'Não informado' })); }
export function registerDeletion(lesson) { return addHistoryEntry(lesson.id, { action: 'Excluiu a ocorrência', field: 'Registro', previousValue: lesson.title, newValue: 'Excluído' }); }
