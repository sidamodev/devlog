import { MOCK_POSTS } from '@/mocks/mock-posts';

export const getPosts = async () => {
  return Promise.resolve(MOCK_POSTS);
};
