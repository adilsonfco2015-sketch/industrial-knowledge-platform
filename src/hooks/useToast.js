import { useCallback, useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const showToast = useCallback((type, message) => {
    setToast({ id: Date.now(), type, message });
    window.setTimeout(() => setToast(null), 4500);
  }, []);
  return { toast, showToast, dismissToast: useCallback(() => setToast(null), []) };
}
