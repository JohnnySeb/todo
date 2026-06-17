import { STORAGE_KEY, DEFAULT_STATE } from './config.js';

export let state = DEFAULT_STATE();
export let saveTimer = null;

export function generateId() {
  if (crypto && crypto.randomUUID) return crypto.randomUUID();
  return `card_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE();
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.columns || !parsed.cards) return DEFAULT_STATE();
    if (!parsed.labels || !parsed.labels.length) parsed.labels = DEFAULT_STATE().labels;
    return parsed;
  } catch (err) {
    return DEFAULT_STATE();
  }
}

export function saveState() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => void persistState(), 250);
}

export async function persistState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {}
  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    });
  } catch (err) {}
}
