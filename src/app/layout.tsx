import Providers from '@/app/providers';
import AppHeader from '@/components/header/app-header';
import AppNav from '@/components/navigation/app-nav';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920', // WebKit 렌더링 버그 방지용 필수
  variable: '--font-pretendard',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  display: 'swap',
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
        className={`${pretendard.variable} ${firaCode.variable} font-sans antialiased bg-accent/60 dark:bg-background`}
      >
        <Providers>
          <div className="min-h-screen">
            <AppHeader />
            <AppNav />
            <div className="min-w-0 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:pb-0">
              <main className="flex justify-center p-4 sm:ml-20">{children}</main>
            </div>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
