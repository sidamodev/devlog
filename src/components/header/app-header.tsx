'use client';
import LogoButton from '@/components/navigation/logo-button';
import dynamic from 'next/dynamic';

const ThemeSwitcher = dynamic(() => import('@/components/theme-switcher/theme-switcher'), { ssr: false });

const AppHeader = () => {
  return (
    <header className="sticky top-0 h-16 px-4 backdrop-blur-xl flex justify-between items-center z-10 sm:border-b">
      <div>
        <LogoButton className="flex sm:hidden" />
      </div>
      <ThemeSwitcher />
    </header>
  );
};
export default AppHeader;
