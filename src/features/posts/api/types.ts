import { PaginatedResponse } from '@/types/pagination';

export type PostListResponse = PaginatedResponse<Post>;

export type Post = {
  id: string;
  title: string;
  slug: string;
  authorId: string;
  author: Author;
  createdAt: string;
  image: string;
  description: string;
  likes: number;
  comments: number;
  bookmarks: number;
};

export type Author = {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
};
