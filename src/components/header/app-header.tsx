import LogoButton from '@/components/navigation/logo-button';
import { LuSearch } from 'react-icons/lu';
import ThemeSwitcher from '@/components/theme-switcher/theme-switcher';
import { Kbd } from '@/components/ui/kbd';

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between px-4 backdrop-blur-xl">
      <div className="sm:ml-2">
        <LogoButton className="w-12" />
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 hover:bg-muted border rounded-md transition-colors w-64 justify-between">
          <div className="flex items-center gap-2">
            <LuSearch className="w-4 h-4" />
            <span>검색...</span>
          </div>
          <Kbd>Ctrl + K</Kbd>
        </button>

        <ThemeSwitcher />
      </div>
    </header>
  );
};
export default AppHeader;
