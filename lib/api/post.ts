import { apiClient } from '@/lib/api/apiClient';
import type { PostList } from '@/types/post';

export const getPostList = async () => {
  const response = await apiClient.get<PostList>('/');
  return response;
};

// export const getPostBySlug = async (slug: string) => {
//   const post = MOCK_POSTS.find((post) => post.slug === slug);
//   return Promise.resolve(post);
// }
