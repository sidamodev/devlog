import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/class-name';
import Link from 'next/link';
import type { IconType } from 'react-icons';

type NavButtonProps = {
  Icon: IconType;
  to: string;
  className?: string;
  active: boolean;
};

const NavButton = ({ Icon: DefaultIcon, className, to, active }: NavButtonProps) => {
  const Icon = DefaultIcon;
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        'p-0 h-10 w-12 active:scale-90 transition duration-200 text-neutral-400 rounded-xl hover:text-none hover:bg-neutral-200 dark:hover:bg-accent',
        active && 'text-accent-foreground',
        className,
      )}
    >
      <Link href={to}>
        <Icon className="size-5 sm:size-6" />
      </Link>
    </Button>
  );
};

export default NavButton;
