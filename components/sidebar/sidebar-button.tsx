import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { IconType } from 'react-icons';

type SidebarButtonProps = {
  defaultIcon: IconType;
  activeIcon: IconType;
  to: string;
  className?: string;
  active: boolean;
};

const SidebarButton = ({
  defaultIcon: DefaultIcon,
  activeIcon: ActiveIcon,
  className,
  to,
  active,
}: SidebarButtonProps) => {
  const Icon = active ? ActiveIcon : DefaultIcon;
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        'p-0 h-14 w-14 rounded-lg active:scale-90 transition duration-200 text-input',
        active && 'text-accent-foreground',
        className,
      )}
    >
      <Link href={to}>
        <Icon className="size-6" />
      </Link>
    </Button>
  );
};

export default SidebarButton;
