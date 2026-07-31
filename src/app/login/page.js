'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoginScreen from '../../components/LoginScreen';
import { apiFetch, saveToken } from '../../services/api';

export default function LoginPage() {
  const router = useRouter(); const [loginData, setLoginData] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [isLoading, setIsLoading] = useState(false);
  async function handleLogin() { setError(''); setIsLoading(true); try { const response = await apiFetch('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginData) }); const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Não foi possível entrar.'); saveToken(data.token); router.replace('/'); } catch (loginError) { setError(loginError.message); } finally { setIsLoading(false); } }
  return <LoginScreen loginData={loginData} setLoginData={setLoginData} handleLogin={handleLogin} error={error} isLoading={isLoading} />;
}
