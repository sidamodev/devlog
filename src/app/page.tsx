import { postKeys } from '@/features/posts/api/keys';
import { getPostList } from '@/features/posts/api/service';
import PostList from '@/features/posts/components/post-list';
import getQueryClient from '@/lib/utils/get-query-client';
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
