type FetchOptions<TBody> = {
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: TBody;
};

type RequestOptions = {
  headers?: Record<string, string>;
};

async function handleResponse<TResponse>(response: Response): Promise<TResponse> {
  if (!response.ok) {
    let message = 'Request failed';

    try {
      const data = await response.json();
      if (typeof data?.error === 'string') {
        message = data.error;
      }
    } catch {
      message = 'Request failed';
    }

    throw new Error(message);
  }

  return response.json() as Promise<TResponse>;
}

async function request<TResponse, TBody>(
  path: string,
  options: FetchOptions<TBody>
): Promise<TResponse> {
  const fetchOptions: RequestInit = {
    method: options.method,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(path, fetchOptions);
  return handleResponse<TResponse>(response);
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  return request<TResponse, never>(path, { method: 'GET' });
}

export async function getJsonWithOptions<TResponse>(
  path: string,
  options?: RequestOptions
): Promise<TResponse> {
  return request<TResponse, never>(path, {
    method: 'GET',
    headers: options?.headers,
  });
}

export async function postJson<TResponse, TBody>(
  path: string,
  body: TBody,
  options?: RequestOptions
): Promise<TResponse> {
  return request<TResponse, TBody>(path, {
    method: 'POST',
    headers: options?.headers,
    body,
  });
}

export async function patchJson<TResponse, TBody>(
  path: string,
  body: TBody,
  options?: RequestOptions
): Promise<TResponse> {
  return request<TResponse, TBody>(path, {
    method: 'PATCH',
    headers: options?.headers,
    body,
  });
}

export async function putJson<TResponse, TBody>(
  path: string,
  body: TBody,
  options?: RequestOptions
): Promise<TResponse> {
  return request<TResponse, TBody>(path, {
    method: 'PUT',
    headers: options?.headers,
    body,
  });
}

export async function deleteJson<TResponse>(
  path: string,
  options?: RequestOptions
): Promise<TResponse> {
  return request<TResponse, never>(path, {
    method: 'DELETE',
    headers: options?.headers,
  });
}
