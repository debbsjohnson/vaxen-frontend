const DEFAULT_BACKEND_BASE_URL = 'http://localhost:8080';

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
