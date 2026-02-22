'use client';
import NavButton from '@/components/navigation/nav-button';
import { useSelectedLayoutSegment } from 'next/navigation';
import { LuChartLine, LuHouse, LuSearch, LuSquarePen, LuUser } from 'react-icons/lu';

const AppNav = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center border-t bg-background sm:top-16 sm:h-[calc(100dvh-4rem)] sm:w-20 sm:flex-col sm:border-t-0 sm:bg-transparent">
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
      <div className="hidden sm:block h-16" /> 
    </nav>
  );
};
export default AppNav;
