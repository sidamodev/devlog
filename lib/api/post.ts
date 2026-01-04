import type { PostList } from '@/types/post';

export const getPostList = async (): Promise<PostList> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
  const data = await response.json();
  return data;
};

// export const getPostBySlug = async (slug: string) => {
//   const post = MOCK_POSTS.find((post) => post.slug === slug);
//   return Promise.resolve(post);
// }
