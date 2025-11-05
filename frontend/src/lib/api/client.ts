const API_BASE: string = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) || "/api";

function buildUrl(path: string): string {
  if (!path) return API_BASE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
}

{/* API 요청 함수 */}
export async function request<T>(path: string, init?: RequestInit): Promise<T> { 
  const url = buildUrl(path);
  const method = (init?.method || 'GET').toUpperCase();
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    // Lightweight client-side trace for debugging during development
    // Do not log sensitive bodies
    // eslint-disable-next-line no-console
    console.debug(`[api] ${method} ${url}`);
  }

  const res = await fetch(url, {
    credentials: 'include',
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    // eslint-disable-next-line no-console
    console.debug(`[api] <- ${res.status} ${res.statusText} ${method} ${url}`);
  }
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    const err = new Error(`${res.status} ${res.statusText}${msg ? ` - ${msg}` : ""}`);
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
      // eslint-disable-next-line no-console
      console.error(`[api] error ${method} ${url}:`, msg);
    }
    throw err;
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export { API_BASE, buildUrl };

