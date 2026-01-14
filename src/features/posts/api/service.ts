import type { PostListResponse } from '@/features/posts/api/types';
import { api } from '@/lib/http/api-client';

export const getPostList = async ({ pageParam }: { pageParam?: string }) => {
  const qs = pageParam ? `?cursor=${encodeURIComponent(pageParam)}` : '';
  return api.get<PostListResponse>(`/${qs}`);
};

// export const getPostBySlug = async (slug: string) => {
//   const post = MOCK_POSTS.find((post) => post.slug === slug);
//   return Promise.resolve(post);
// }
