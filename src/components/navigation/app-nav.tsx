'use client';
import LogoButton from '@/components/navigation/logo-button';
import NavButton from '@/components/navigation/nav-button';
import { useSelectedLayoutSegment } from 'next/navigation';
import { LuChartLine, LuHouse, LuSearch, LuSquarePen, LuUser } from 'react-icons/lu';

const AppNav = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <nav className="border-t sm:border-t-0 fixed h-16 flex bg-background sm:bg-transparent sm:flex-col bottom-0 items-center sm:h-screen sm:top-0 shrink-0 sm:sticky w-full sm:w-20 sm:pb-20 z-50">
      <LogoButton />
      <div className="flex sm:flex-col justify-around sm:justify-center sm:items-center flex-1 sm:gap-6">
        <NavButton to="/" active={segment === null} Icon={LuHouse} />
        <NavButton to="/search" active={segment === 'search'} Icon={LuSearch} />
        <NavButton
          to="/write"
          active={segment === 'write'}
          Icon={LuSquarePen}
          className="bg-neutral-200 dark:bg-neutral-700"
        />
        <NavButton to="/stats" active={segment === 'stats'} Icon={LuChartLine} />
        <NavButton to="/profile/user" active={segment === 'profile'} Icon={LuUser} />
      </div>
    </nav>
  );
};
export default AppNav;
