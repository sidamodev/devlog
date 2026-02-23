import Logo from '@/assets/logo.svg';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const LogoButton = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        'flex justify-center items-center p-0 h-16 rounded-lg active:scale-100 transition duration-300 text-accent-foreground dark:hover:bg-transparent hover:bg-transparent hover:scale-120',
        className,
      )}
    >
      <Logo className="size-6" />
    </Link>
  );
};
export default LogoButton;
