import { api } from '@/lib/http/api-client';
import type { PostList } from '@/features/posts/api/types';

export const getPostList = async ({ pageParam }: { pageParam: string | null }) => {
  const response = await api.get<PostList>(`/?cursor=${pageParam}`);
  return response;
};

// export const getPostBySlug = async (slug: string) => {
//   const post = MOCK_POSTS.find((post) => post.slug === slug);
//   return Promise.resolve(post);
// }
