'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { completeUsernameSetupAction } from '@/features/users/server/actions';
import { normalizeUsername, USERNAME_MAX_LENGTH } from '@/features/users/shared/username.utils';
import { useState } from 'react';
import { toast } from 'sonner';

type UsernameOnboardingFormProps = {
  initialUsername: string;
  displayName: string;
};

export const UsernameOnboardingForm = ({
  initialUsername,
  displayName,
}: UsernameOnboardingFormProps) => {
  const [username, setUsername] = useState(initialUsername);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    setIsPending(true);

    const result = await completeUsernameSetupAction({ username });

    if (!result.ok) {
      toast.error(result.message);
      if (result.normalizedUsername !== undefined) {
        setUsername(result.normalizedUsername);
      }
      setIsPending(false);
      return;
    }

    window.location.assign(`/@${result.username}`);
  };

  const previewUsername = normalizeUsername(username);

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-foreground">
          아이디
        </label>
        <Input
          id="username"
          name="username"
          value={username}
          maxLength={USERNAME_MAX_LENGTH}
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="username"
          spellCheck={false}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          placeholder="your-name"
        />
        <p className="text-sm text-muted-foreground">
          공개 프로필 URL은 <span className="font-medium text-foreground">@{previewUsername || 'username'}</span> 으로
          표시됩니다.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '저장 중...' : `${displayName}님의 아이디 저장`}
      </Button>
    </form>
  );
};
