// core (vaxen/core) listens on :9090 by default. Override with
// BACKEND_API_URL (server-side, e.g. inside Docker) or
// NEXT_PUBLIC_API_URL (for any client-direct calls — there shouldn't be
// any, but the env stays compatible).
const DEFAULT_BACKEND_BASE_URL = 'http://localhost:9090';

function getBackendBaseUrl() {
  return (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_BACKEND_BASE_URL
  );
}

export async function fetchBackend(path: string, init?: RequestInit) {
  const backendBaseUrl = getBackendBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(normalizedPath, backendBaseUrl);

  return fetch(url, init);
}
