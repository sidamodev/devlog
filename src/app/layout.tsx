import Providers from '@/app/providers';
import AppHeader from '@/components/header/app-header';
import AppNav from '@/components/navigation/app-nav';
import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920', // WebKit 렌더링 버그 방지용 필수
  variable: '--font-pretendard',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['100', '900'],
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
      <body
        className={`${pretendard.variable} ${geistMono.variable} font-sans antialiased bg-accent/60 dark:bg-background`}
      >
        <Providers>
          <div className="flex min-h-screen">
            <AppNav />
            <div className="flex min-w-0 flex-col flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
              <AppHeader />
              <main className="flex justify-center p-4">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
