import AppHeader from '@/components/header/app-header';
import AppNav from '@/components/navigation/app-nav';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'devlog',
  description: 'Blog by sdiamodev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-accent/60 dark:bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen">
            <AppNav />
            <div className="flex min-w-0 flex-col flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
              <AppHeader />
              <main className="flex w-full flex-col items-center p-4">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
