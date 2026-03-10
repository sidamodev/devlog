import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/users/server/service';
import { buildUsernameBaseCandidates } from '@/features/users/shared/username.utils';
import { UsernameOnboardingForm } from '@/features/users/ui/username-onboarding-form';

const UsernameOnboardingPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  if (currentUser.username) {
    redirect(`/@${currentUser.username}`);
  }

  const suggestedUsername = buildUsernameBaseCandidates(currentUser)[0] ?? 'user';

  return (
    <section className="flex w-full max-w-lg justify-center py-10">
      <div className="w-full rounded-3xl border border-border/50 bg-background/90 p-8 shadow-sm">
        <div className="mb-8 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">아이디 설정</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            공개 프로필과 글 URL에 사용할 아이디를 먼저 정해주세요.
          </p>
        </div>

        <UsernameOnboardingForm
          initialUsername={suggestedUsername ?? 'user'}
          displayName={currentUser.name ?? '사용자'}
        />
      </div>
    </section>
  );
};

export default UsernameOnboardingPage;
