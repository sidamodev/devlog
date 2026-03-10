import { getCurrentUser } from '@/features/users/server/service';
import { redirect } from 'next/navigation';
import PostWriteForm from '@/features/posts/ui/post-write-form';

const WritePage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/');
  }

  if (!currentUser.username) {
    redirect('/onboarding/username');
  }

  return (
    <div className="flex w-full justify-center overflow-clip sm:max-w-2xl">
      <PostWriteForm />
    </div>
  );
};
export default WritePage;
