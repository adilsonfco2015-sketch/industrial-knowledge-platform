'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UsersAdmin from '../../components/UsersAdmin';
import { apiFetch, clearToken } from '../../services/api';

export default function UsersPage() {
  const router = useRouter(); const [user, setUser] = useState(null);
  useEffect(() => { async function loadUser() { const response = await apiFetch('/auth/me'); if (!response.ok) { clearToken(); router.replace('/login'); return; } setUser((await response.json()).user); } loadUser(); }, [router]);
  if (!user) return <div className="grid min-h-screen place-items-center bg-slate-950 text-sm font-semibold text-slate-300">Validando sessão...</div>;
  return <main className="min-h-screen bg-slate-100 p-4 sm:p-8"><div className="mx-auto max-w-7xl"><button onClick={() => router.replace('/')} className="mb-6 text-sm font-semibold text-cyan-700">← Voltar ao Dashboard</button><h1 className="mb-6 text-3xl font-bold text-slate-900">Administração de usuários</h1><UsersAdmin currentUser={user} /></div></main>;
}
