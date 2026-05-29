const CSRF_STORAGE_KEY = 'vaxen_csrf_token';
const USER_STORAGE_KEY = 'vaxen_auth_user';

function isBrowser() {
  return typeof window !== 'undefined';
}

type SetClientAuthStateInput = {
  csrfToken?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    organizationId: string;
    role: string;
  };
};

export function setClientAuthState(input: SetClientAuthStateInput = {}) {
  if (!isBrowser()) {
    return;
  }

  if (input.csrfToken) {
    window.sessionStorage.setItem(CSRF_STORAGE_KEY, input.csrfToken);
  }

  if (input.user) {
    window.sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(input.user));
  }
}

export function clearClientAuthState() {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(CSRF_STORAGE_KEY);
  window.sessionStorage.removeItem(USER_STORAGE_KEY);
}

export function getStoredCsrfToken() {
  if (!isBrowser()) {
    return undefined;
  }

  return window.sessionStorage.getItem(CSRF_STORAGE_KEY) || undefined;
}

export function getStoredAuthUser() {
  if (!isBrowser()) {
    return undefined;
  }

  const raw = window.sessionStorage.getItem(USER_STORAGE_KEY);
  if (!raw) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as SetClientAuthStateInput['user'];
  } catch {
    return undefined;
  }
}
