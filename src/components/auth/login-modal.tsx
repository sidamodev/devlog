'use client';

import Logo from '@/assets/logo.svg';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { signIn } from '@/lib/auth-client';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export function LoginModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 rounded-full px-3 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all"
        >
          로그인
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 sm:max-w-105 sm:rounded-2xl border-border/40 shadow-2xl overflow-hidden duration-300">
        <div className="flex flex-col items-center justify-center px-8 pb-6 pt-10 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/50 shadow-sm transition-transform duration-500 hover:scale-105 hover:rotate-3">
            <Logo className="h-8 w-8 text-foreground" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-semibold tracking-tight">
              devlog 시작하기
            </DialogTitle>
            <DialogDescription className="text-center text-[15px] mt-2 leading-relaxed">
              온전히 생각에 집중할 수 있는 나만의 공간
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex flex-col gap-3 px-8 pb-10">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl text-[15px] font-medium shadow-sm transition-all duration-300 hover:bg-muted hover:shadow-md active:scale-[0.98]"
            onClick={() => {
              void signIn.social({ provider: 'github', callbackURL: '/onboarding/username' });
            }}
          >
            <FaGithub className="mr-3 h-5 w-5" />
            GitHub로 계속하기
          </Button>
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl text-[15px] font-medium shadow-sm transition-all duration-300 hover:bg-muted hover:shadow-md active:scale-[0.98]"
            onClick={() => {
              void signIn.social({ provider: 'google', callbackURL: '/onboarding/username' });
            }}
          >
            <FaGoogle className="mr-3 h-5 w-5 text-muted-foreground" />
            Google로 계속하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
