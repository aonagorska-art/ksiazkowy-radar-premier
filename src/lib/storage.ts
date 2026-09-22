export function readStored<T>(key: string, fallback: T): T { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback } }
export function saveStored<T>(key: string, value: T) { try { localStorage.setItem(key,JSON.stringify(value)) } catch { /* storage may be unavailable */ } }
