'use client';
import dynamic from 'next/dynamic';

const ThemeSwitch = dynamic(() => import('@/components/switch/theme-switch'), { ssr: false });

const GlobalHeader = () => {
  return (
    <header className="w-full sticky top-0 h-16 px-4 backdrop-blur-xs flex justify-between items-center z-10">
      <div></div>
      <ThemeSwitch />
    </header>
  );
};
export default GlobalHeader;
