import type { PostList } from '@/types/post';
import { api as serverApi } from '../lib/http/api.server';
import { api as browserApi } from '../lib/http/api.browser';

const api = typeof window === 'undefined' ? serverApi : browserApi;

export const getPostList = async () => {
  const response = await api.get<PostList>('/');
  return response;
};

// export const getPostBySlug = async (slug: string) => {
//   const post = MOCK_POSTS.find((post) => post.slug === slug);
//   return Promise.resolve(post);
// }
