import { useEffect, useRef, useState } from 'react';
import { API_URL, apiFetch, getToken } from '../services/api';
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- sincroniza anexos da API ao abrir a lição. */

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const allowedExtensions = new Set(['jpg', 'jpeg', 'png', 'webp', 'pdf', 'docx', 'xlsx']);
const allowed = '.jpg,.jpeg,.png,.webp,.pdf,.docx,.xlsx';

async function responseMessage(response, fallback) {
  try {
    const body = await response.json();
    return body.message || fallback;
  } catch {
    return fallback;
  }
}

function validateFile(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.has(extension)) return 'Formato não permitido. Envie JPG, PNG, WEBP, PDF, DOCX ou XLSX.';
  if (file.size > MAX_FILE_SIZE) return 'O arquivo excede o limite de 20 MB.';
  return null;
}

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AttachmentsPanel({ lessonId }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [openingId, setOpeningId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const input = useRef(null);

  async function loadFiles() {
    const response = await apiFetch(`/lessons/${encodeURIComponent(lessonId)}/files`);
    if (!response.ok) {
      setError(await responseMessage(response, 'Não foi possível carregar os anexos.'));
      return;
    }
    setFiles(await response.json());
  }

  useEffect(() => { loadFiles(); }, [lessonId]);

  function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const validationError = validateFile(file);
    input.current.value = '';
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);
    const body = new FormData();
    body.append('file', file);
    const request = new XMLHttpRequest();
    request.open('POST', `${API_URL}/lessons/${encodeURIComponent(lessonId)}/files`);
    const token = getToken();
    if (token) request.setRequestHeader('Authorization', `Bearer ${token}`);
    request.upload.onprogress = (progressEvent) => {
      if (progressEvent.lengthComputable) setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
    };
    request.onload = async () => {
      setUploading(false);
      if (request.status >= 200 && request.status < 300) {
        setProgress(100);
        await loadFiles();
      } else {
        try {
          setError(JSON.parse(request.responseText || '{}').message || 'Não foi possível enviar o arquivo.');
        } catch {
          setError('Não foi possível enviar o arquivo. Tente novamente.');
        }
      }
    };
    request.onerror = () => {
      setUploading(false);
      setError('Falha de conexão durante o upload. Verifique sua internet e tente novamente.');
    };
    request.ontimeout = () => {
      setUploading(false);
      setError('O upload demorou mais que o esperado. Tente novamente.');
    };
    request.timeout = 120000;
    request.send(body);
  }

  async function accessFile(file, newTab = false) {
    setError('');
    setOpeningId(file.id);
    try {
      const response = await apiFetch(`/files/${file.id}/download`);
      if (!response.ok) throw new Error(await responseMessage(response, 'Não foi possível preparar o arquivo.'));
      const { url } = await response.json();
      if (newTab) window.open(url, '_blank', 'noopener,noreferrer');
      else window.location.assign(url);
    } catch (accessError) {
      setError(accessError.message);
    } finally {
      setOpeningId(null);
    }
  }

  async function remove(file) {
    if (!window.confirm(`Excluir o anexo “${file.originalName}”?`)) return;
    setError('');
    setRemovingId(file.id);
    try {
      const response = await apiFetch(`/files/${file.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(await responseMessage(response, 'Não foi possível excluir o arquivo.'));
      await loadFiles();
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setRemovingId(null);
    }
  }

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold tracking-[0.15em] text-cyan-700">EVIDÊNCIAS</p><h2 className="mt-2 text-xl font-bold text-slate-900">Anexos</h2><p className="mt-1 text-sm text-slate-500">JPG, PNG, WEBP, PDF, DOCX e XLSX · máximo de 20 MB.</p></div><input ref={input} type="file" accept={allowed} onChange={upload} className="hidden" /><button type="button" onClick={() => input.current?.click()} disabled={uploading} className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{uploading ? 'Enviando...' : 'Adicionar arquivo'}</button></div>{uploading && <div className="mt-5" role="status" aria-live="polite"><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div style={{ width: `${progress}%` }} className="h-full rounded-full bg-cyan-600 transition-all" /></div><p className="mt-2 text-xs text-slate-500">Upload: {progress}%</p></div>}{error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-6 space-y-3">{files.length ? files.map((file) => <article key={file.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4"><div className="min-w-0"><p className="truncate font-semibold text-slate-800">📎 {file.originalName}</p><p className="mt-1 text-xs text-slate-500">{formatFileSize(file.fileSize)} · {new Date(file.createdAt).toLocaleString('pt-BR')}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => accessFile(file, true)} disabled={openingId === file.id} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-cyan-700 shadow-sm disabled:opacity-60">Visualizar</button><button type="button" onClick={() => accessFile(file)} disabled={openingId === file.id} className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-60">Download</button><button type="button" onClick={() => remove(file)} disabled={removingId === file.id} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-60">{removingId === file.id ? 'Excluindo...' : 'Excluir'}</button></div></article>) : <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">Nenhum anexo enviado.</p>}</div></section>;
}
