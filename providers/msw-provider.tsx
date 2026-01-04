'use client';
import { useEffect, useState, type ReactNode } from 'react';

const MSWProvider = ({ children }: { children: ReactNode }) => {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const initMsw = async () => {
      if (process.env.NODE_ENV !== 'development' || process.env.NEXT_PUBLIC_API_MOCKING !== 'true') {
        setIsReady(true);
        return;
      }

      if (typeof window !== 'undefined') {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
        setIsReady(true);
      }
    };

    initMsw();
  }, []);

  if (!isReady) return null;
  return <>{children}</>;
};
export default MSWProvider;
