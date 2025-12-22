'use client';
import SidebarButton from '@/components/sidebar/sidebar-button';
import SidebarLogo from '@/components/sidebar/sidebar-logo';
import { useSelectedLayoutSegment } from 'next/navigation';
import { BiBell, BiCog, BiHome, BiPencil, BiSolidBell, BiSolidCog, BiSolidHome, BiSolidPencil } from 'react-icons/bi';

const Sidebar = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <aside className="fixed bg-accent flex sm:bg-transparent sm:flex-col bottom-0 items-center sm:h-screen sm:top-0 shrink-0 sm:sticky w-full sm:w-14 sm:pb-20 z-1000">
      <SidebarLogo />
      <div className="flex sm:flex-col justify-around sm:justify-center sm:items-center flex-1">
        <SidebarButton active={segment === null} defaultIcon={BiHome} activeIcon={BiSolidHome} to="/" />
        <SidebarButton active={segment === 'write'} defaultIcon={BiPencil} activeIcon={BiSolidPencil} to="/write" />
        <SidebarButton
          active={segment === 'notification'}
          defaultIcon={BiBell}
          activeIcon={BiSolidBell}
          to="/notification"
        />
        <SidebarButton active={segment === 'setting'} defaultIcon={BiCog} activeIcon={BiSolidCog} to="/setting" />
      </div>
    </aside>
  );
};
export default Sidebar;
