const fallbackApiUrl = 'https://ingenious-patience-production-08cc.up.railway.app/api';
const tokenKey = 'industrial-token';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || fallbackApiUrl).replace(/\/$/, '');
export const getToken = () => typeof window === 'undefined' ? null : localStorage.getItem(tokenKey);
export function saveToken(token) { localStorage.setItem(tokenKey, token); document.cookie = `${tokenKey}=${encodeURIComponent(token)}; path=/; max-age=28800; samesite=lax`; }
export function clearToken() { localStorage.removeItem(tokenKey); document.cookie = `${tokenKey}=; path=/; max-age=0; samesite=lax`; }
export function apiFetch(path, options = {}) { const token = getToken(); const headers = new Headers(options.headers); if (token) headers.set('Authorization', `Bearer ${token}`); return fetch(`${API_URL}${path}`, { ...options, headers }); }
