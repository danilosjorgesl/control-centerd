const KEY = 'operacao_danilo_v1';

export function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { console.warn('Storage error', e); }
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

export function clear() {
  localStorage.removeItem(KEY);
}
