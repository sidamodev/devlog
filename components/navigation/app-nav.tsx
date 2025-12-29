'use client';
import NavButton from '@/components/navigation/nav-button';
import LogoButton from '@/components/navigation/logo-button';
import { useSelectedLayoutSegment } from 'next/navigation';
import { BiBell, BiCog, BiHome, BiPencil, BiSolidBell, BiSolidCog, BiSolidHome, BiSolidPencil } from 'react-icons/bi';

const AppNav = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <nav className="fixed bg-accent flex sm:bg-transparent sm:flex-col bottom-0 items-center sm:h-screen sm:top-0 shrink-0 sm:sticky w-full sm:w-14 sm:pb-20 z-50 sm:border-r">
      <LogoButton />
      <div className="flex sm:flex-col justify-around sm:justify-center sm:items-center flex-1">
        <NavButton active={segment === null} defaultIcon={BiHome} activeIcon={BiSolidHome} to="/" />
        <NavButton active={segment === 'write'} defaultIcon={BiPencil} activeIcon={BiSolidPencil} to="/write" />
        <NavButton
          active={segment === 'notification'}
          defaultIcon={BiBell}
          activeIcon={BiSolidBell}
          to="/notification"
        />
        <NavButton active={segment === 'setting'} defaultIcon={BiCog} activeIcon={BiSolidCog} to="/setting" />
      </div>
    </nav>
  );
};
export default AppNav;
