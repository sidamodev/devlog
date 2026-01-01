'use client';
import { ThemeProvider } from '@/providers/theme-provider';
import getQueryClient from '@/lib/utils/get-query-client';
import { QueryClientProvider } from '@tanstack/react-query';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};
export default Providers;
