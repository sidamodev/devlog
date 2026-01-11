type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

class InterceptorManager<T, E = unknown> {
  handlers: Array<{
    onFulfilled: (value: T) => T | Promise<T>;
    onRejected?: (e: E) => T | Promise<T>;
  }> = [];

  use(onFulfilled: (value: T) => T | Promise<T>, onRejected?: (e: E) => T | Promise<T>) {
    this.handlers.push({ onFulfilled, onRejected });
  }

  async run(value: T): Promise<T> {
    let current = value;
    for (const handler of this.handlers) {
      try {
        current = await handler.onFulfilled(current);
      } catch (e) {
        if (handler.onRejected) current = await handler.onRejected(e as E);
        else throw e;
      }
    }
    return current;
  }
}

export class ApiClientCore {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  interceptors = {
    request: new InterceptorManager<RequestInit>(),
    response: new InterceptorManager<Response>(),
  };

  constructor(baseURL: string, defaultHeaders?: HeadersInit) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      ...defaultHeaders,
    };
  }

  private async request<T>(path: string, options?: FetchOptions): Promise<T> {
    const url = `${this.baseURL}${path}`;
    const headers = new Headers(this.defaultHeaders);

    const config = {
      ...options,
      headers: {
        ...Object.fromEntries(headers),
        ...options?.headers,
      },
    };

    const finalConfig = await this.interceptors.request.run(config);
    const response = await fetch(url, finalConfig);
    const finalResponse = await this.interceptors.response.run(response);

    if (!finalResponse.ok) {
      throw new Error(`API Error: ${finalResponse.status}`);
    }

    return await finalResponse.json();
  }

  async get<T>(path: string, options?: FetchOptions): Promise<T> {
    return this.request(path, { ...options, method: 'GET' });
  }

  async post<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return this.request(path, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  async patch<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return this.request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  async delete<T>(path: string, options?: FetchOptions): Promise<T> {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}
