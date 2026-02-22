import type { PostListApiResponse } from '@/features/posts/shared/post.contracts';
import { api } from '@/lib/http/api-client';
import { mapPostDtoToSummary } from '../shared/post-mapper';

export const getPostList = async ({ pageParam }: { pageParam?: string }) => {
  const qs = pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : '';
  const response = await api.get<PostListApiResponse>(`/posts${qs}`);

  return mapPostDtoToSummary(response);
};
