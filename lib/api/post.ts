import { MOCK_POSTS } from '@/mocks/mock-posts';

export const getPostList = async () => {
  return Promise.resolve(MOCK_POSTS);
};

// export const getPostBySlug = async (slug: string) => {
//   const post = MOCK_POSTS.find((post) => post.slug === slug);
//   return Promise.resolve(post);
// }