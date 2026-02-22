import { getPostListResponse } from '@/features/posts/server/service';
import { mapPostDtoToSummary } from '@/features/posts/shared/post-mapper';
import { postKeys } from '@/features/posts/shared/post-query-keys';
import PostList from '@/features/posts/ui/post-list';
import getQueryClient from '@/lib/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const MainPage = async () => {
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: async ({ pageParam }) => {
      const response = await getPostListResponse(pageParam);
      return mapPostDtoToSummary(response);
    },
    initialPageParam: undefined,
  });

  return (
    <section aria-label="Posts" className="w-full sm:max-w-3xl">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostList />
      </HydrationBoundary>
    </section>
  );
};
export default MainPage;
