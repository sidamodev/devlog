'use client';
import SidebarLogo from '@/components/sidebar/sidebar-logo';
import dynamic from 'next/dynamic';

const ThemeSwitch = dynamic(() => import('@/components/switch/theme-switch'), { ssr: false });

const AppHeader = () => {
  return (
    <header className="sticky top-0 h-16 px-4 backdrop-blur-xl flex justify-between items-center z-10">
      <div>
        <SidebarLogo className="flex sm:hidden" />
      </div>
      <ThemeSwitch />
    </header>
  );
};
export default AppHeader;
