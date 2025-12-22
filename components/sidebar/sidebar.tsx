'use client';
import SidebarButton from '@/components/sidebar/sidebar-button';
import SidebarLogo from '@/components/sidebar/sidebar-logo';
import { useSelectedLayoutSegment } from 'next/navigation';
import { BiBell, BiCog, BiHome, BiPencil, BiSolidBell, BiSolidCog, BiSolidHome, BiSolidPencil } from 'react-icons/bi';

const Sidebar = () => {
  const segment = useSelectedLayoutSegment();
  return (
    <aside className="hidden sm:flex flex-col items-center h-screen top-0 shrink-0 sticky pb-20">
      <SidebarLogo />
      <div className="flex flex-col justify-center items-center flex-1">
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
