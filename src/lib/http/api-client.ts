/**
 * fetch API의 기본 옵션과 Next.js 확장 옵션을 포함하는 타입 정의입니다.
 */
type FetchOptions = RequestInit & {
  next?: {
    /**
     * 리소스 캐시 유효 시간(초)입니다. false로 설정하면 캐시하지 않습니다.
     */
    revalidate?: number | false;
    /**
     * 캐시 무효화를 위한 태그 목록입니다.
     */
    tags?: string[];
  };
};

/**
 * 요청 또는 응답을 가로채서 처리하는 인터셉터 관리자 클래스입니다.
 * @template T - 처리할 값의 타입 (RequestInit 또는 Response)
 * @template E - 에러 타입 (기본값: unknown)
 */
class InterceptorManager<T, E = unknown> {
  handlers: Array<{
    onFulfilled: (value: T) => T | Promise<T>;
    onRejected?: (e: E) => T | Promise<T>;
  }> = [];

  /**
   * 인터셉터를 등록합니다.
   * @param onFulfilled - 성공 시 실행될 콜백 함수
   * @param onRejected - 실패 시 실행될 콜백 함수 (선택 사항)
   */
  use(onFulfilled: (value: T) => T | Promise<T>, onRejected?: (e: E) => T | Promise<T>) {
    this.handlers.push({ onFulfilled, onRejected });
  }

  /**
   * 등록된 모든 인터셉터를 순차적으로 실행합니다.
   * @param value - 초기 값
   * @returns 처리된 최종 값
   */
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

/**
 * HTTP 요청을 처리하는 API 클라이언트 클래스입니다.
 * 인터셉터와 기본 헤더 설정을 지원합니다.
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  /**
   * 요청 및 응답 인터셉터 관리자입니다.
   */
  interceptors = {
    request: new InterceptorManager<RequestInit>(),
    response: new InterceptorManager<Response>(),
  };

  /**
   * ApiClient 인스턴스를 생성합니다.
   * @param baseURL - API의 기본 URL
   * @param defaultHeaders - 모든 요청에 포함될 기본 헤더
   */
  constructor(baseURL: string, defaultHeaders?: HeadersInit) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      ...defaultHeaders,
    };
  }

  /**
   * 내부적으로 사용되는 요청 처리 메서드입니다.
   * 인터셉터를 실행하고 실제 fetch 요청을 수행합니다.
   * @param path - 요청할 API 경로
   * @param options - fetch 옵션
   * @returns 응답 데이터 (JSON 파싱됨)
   */
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

  /**
   * GET 요청을 보냅니다.
   * @param path - 요청할 API 경로
   * @param options - fetch 옵션
   * @returns 응답 데이터
   */
  async get<T>(path: string, options?: FetchOptions): Promise<T> {
    return this.request(path, { ...options, method: 'GET' });
  }

  /**
   * POST 요청을 보냅니다.
   * @param path - 요청할 API 경로
   * @param body - 요청 본문 데이터
   * @param options - fetch 옵션
   * @returns 응답 데이터
   */
  async post<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return this.request(path, { ...options, method: 'POST', body: JSON.stringify(body) });
  }

  /**
   * PATCH 요청을 보냅니다.
   * @param path - 요청할 API 경로
   * @param body - 요청 본문 데이터
   * @param options - fetch 옵션
   * @returns 응답 데이터
   */
  async patch<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    return this.request(path, { ...options, method: 'PATCH', body: JSON.stringify(body) });
  }

  /**
   * DELETE 요청을 보냅니다.
   * @param path - 요청할 API 경로
   * @param options - fetch 옵션
   * @returns 응답 데이터
   */
  async delete<T>(path: string, options?: FetchOptions): Promise<T> {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}

/**
 * 기본 설정이 적용된 API 클라이언트 인스턴스입니다.
 * 환경 변수에서 API URL을 가져오며, 기본 Content-Type은 application/json입니다.
 */
export const api = new ApiClient(process.env.NEXT_PUBLIC_API_URL as string, {
  'Content-Type': 'application/json',
});