'use client';
import getQueryClient from '@/lib/get-query-client';
import MSWProvider from '@/providers/msw-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { QueryClientProvider } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  return (
    <MSWProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </MSWProvider>
  );
};
export default Providers;
