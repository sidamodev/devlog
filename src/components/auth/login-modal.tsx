'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

export function LoginModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full font-semibold px-4 hover:bg-muted/50 border border-transparent hover:border-border transition-all"
        >
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Welcome back</DialogTitle>
          <DialogDescription className="text-center">Sign in to your Devlog account to continue</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              void signIn('github');
            }}
          >
            <FaGithub className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              void signIn('google');
            }}
          >
            <FaGoogle className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
