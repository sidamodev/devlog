import { LoginModal } from '@/components/auth/login-modal';
import { UserDropdown } from '@/components/auth/user-dropdown';
import LogoButton from '@/components/navigation/logo-button';
import ThemeSwitcher from '@/components/theme-switcher/theme-switcher';
import { getCurrentUser } from '@/features/users/server/service';

const AppHeader = async () => {
  const currentUser = await getCurrentUser();
  const profileHref = currentUser?.username ? `/@${currentUser.username}` : '/onboarding/username';

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between px-4 backdrop-blur-xl border-b border-border/40">
      <LogoButton className="sm:ml-2" />

      <div className="flex items-center gap-2 sm:gap-4 pr-2">
        <ThemeSwitcher />
        {currentUser ? <UserDropdown profileHref={profileHref} /> : <LoginModal />}
      </div>
    </header>
  );
};
export default AppHeader;
