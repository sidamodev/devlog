type FetchOptions = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async getAuthHeader(): Promise<HeadersInit> {
    if (typeof window === 'undefined') {
      // Server
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;
      return token ? { Authorization: `Bearer ${token}` } : {};
    } else {
      // Client
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];
      return token ? { Authorization: `Bearer ${token}` } : {};
    }
  }

  private async request<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = new Headers(this.defaultHeaders);
    const authHeader = await this.getAuthHeader();

    const config = {
      ...options,
      headers: {
        ...Object.fromEntries(headers),
        ...options?.headers,
        ...authHeader,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  async patch<T>(endpoint: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return this.request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  async delete<T>(endpoint: string, options?: FetchOptions): Promise<T> {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL!);
