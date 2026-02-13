import type { PostListApiResponse, PostSummaryDto } from '@/features/posts/shared/post.contracts';
import type { PostListResponse, PostSummary } from '@/features/posts/shared/post.types';
import { api } from '@/lib/http/api-client';

export const getPostList = async ({ pageParam }: { pageParam?: string }) => {
  const qs = pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : '';
  const response = await api.get<PostListApiResponse>(`/posts${qs}`);

  return {
    ...response,
    data: response.data.map(
      (post: PostSummaryDto): PostSummary => ({
        ...post,
        author: {
          ...post.author,
          avatar: post.author.avatar ?? undefined,
        },
      }),
    ),
  } satisfies PostListResponse;
};
