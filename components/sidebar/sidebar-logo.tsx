// import Logo from '@/app/icon.svg';
import Logo from '@/components/sidebar/logo';
import Link from 'next/link';

const SidebarLogo = () => {
  return (
    <Link
      href="/"
      className="flex justify-center items-center p-0 h-14 w-14 rounded-lg active:scale-100 transition duration-300 text-accent-foreground dark:hover:bg-transparent hover:bg-transparent hover:scale-120"
    >
      <Logo className="size-6" />
    </Link>
  );
};
export default SidebarLogo;
