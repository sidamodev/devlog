import LogoButton from '@/components/navigation/logo-button';
import ThemeSwitcher from '../theme-switcher/theme-switcher';

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between px-4 backdrop-blur-xl">
      <div className="sm:ml-2">
        <LogoButton className="w-12" />
      </div>
      <ThemeSwitcher />
    </header>
  );
};
export default AppHeader;
