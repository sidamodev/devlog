'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut, useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LuLogOut, LuUser } from 'react-icons/lu';

export function UserDropdown({ profileHref }: { profileHref: string }) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) return null;

  const { name, email, image } = session.user;
  const initials = name?.substring(0, 2).toUpperCase() ?? email?.substring(0, 2).toUpperCase() ?? 'U';

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 cursor-pointer border border-border/50 hover:opacity-80 transition-opacity">
          {image ? <AvatarImage src={image} alt={name ?? 'User Avatar'} /> : null}
          <AvatarFallback className="bg-muted text-xs font-medium text-foreground">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-1" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{name ?? 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={profileHref}>
            <LuUser className="mr-2 size-4" />
            <span>프로필</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LuLogOut className="mr-2 size-4" />
          <span>로그아웃</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
