export const saveSessionPayload = (prefix: string, payload: unknown) => {
  if (typeof window === 'undefined') {
    throw new Error('sessionStorage is not available');
  }

  const key = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.sessionStorage.setItem(key, JSON.stringify(payload));
  return key;
};

export const loadSessionPayload = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.sessionStorage.getItem(key);
  if (!raw) {
    return null;
  }

  return JSON.parse(raw) as T;
};
