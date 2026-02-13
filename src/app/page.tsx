import { getPostList } from '@/features/posts/client/post-list.api';
import { postKeys } from '@/features/posts/client/post-query-keys';
import PostList from '@/features/posts/ui/post-list';
import getQueryClient from '@/lib/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const MainPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: getPostList,
    initialPageParam: undefined,
  });
  return (
    <section aria-label="Posts" className="w-full max-w-md sm:max-w-2xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostList />
      </HydrationBoundary>
    </section>
  );
};
export default MainPage;
