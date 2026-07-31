import { memo } from 'react';
const styles = { success: 'border-emerald-200 bg-emerald-50 text-emerald-800', error: 'border-red-200 bg-red-50 text-red-800', warning: 'border-amber-200 bg-amber-50 text-amber-800' };
const icons = { success: '✓', error: '!', warning: '!' };
function Toast({ toast, onDismiss }) { if (!toast) return null; return <div role="status" className={`fixed bottom-5 right-5 z-[70] flex max-w-sm items-start gap-3 rounded-xl border p-4 shadow-xl motion-safe:animate-[toastIn_220ms_ease-out] ${styles[toast.type]}`}><span className="grid h-6 w-6 place-items-center rounded-full bg-white/70 font-bold">{icons[toast.type]}</span><p className="flex-1 text-sm font-semibold leading-6">{toast.message}</p><button title="Fechar aviso" onClick={onDismiss} className="text-lg leading-none opacity-70 hover:opacity-100">×</button></div>; }
export default memo(Toast);
