export async function register() {
  // 서버 환경에서 MSW 등록
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_RUNTIME === 'nodejs' &&
    process.env.NEXT_PUBLIC_API_MOCKING === 'true'
  ) {
    const { server } = await import('./mocks/server');
    server.listen({
      onUnhandledRequest: 'bypass',
    });
    console.log('[MSW] Server Side Mocking Enabled');
  }
}
