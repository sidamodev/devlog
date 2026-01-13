'use client';
import NavButton from '@/components/navigation/nav-button';
import LogoButton from '@/components/navigation/logo-button';
import { useSelectedLayoutSegment } from 'next/navigation';
import { BiBell, BiCog, BiHome, BiPencil, BiSolidBell, BiSolidCog, BiSolidHome, BiSolidPencil } from 'react-icons/bi';

const NAV_ITEMS = [
  { segment: null, defaultIcon: BiHome, activeIcon: BiSolidHome, to: '/' },
  { segment: 'write', defaultIcon: BiPencil, activeIcon: BiSolidPencil, to: '/write' },
  { segment: 'notification', defaultIcon: BiBell, activeIcon: BiSolidBell, to: '/notification' },
  { segment: 'setting', defaultIcon: BiCog, activeIcon: BiSolidCog, to: '/setting' },
] as const;

const AppNav = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <nav className="fixed bg-accent flex sm:bg-transparent sm:flex-col bottom-0 items-center sm:h-screen sm:top-0 shrink-0 sm:sticky w-full sm:w-14 sm:pb-20 z-50 sm:border-r">
      <LogoButton />
      <div className="flex sm:flex-col justify-around sm:justify-center sm:items-center flex-1">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.to}
            to={item.to}
            active={segment === item.segment}
            defaultIcon={item.defaultIcon}
            activeIcon={item.activeIcon}
          />
        ))}
      </div>
    </nav>
  );
};
export default AppNav;
