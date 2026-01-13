import { PaginatedResponse } from '@/types/pagination';

export type PostList = PaginatedResponse<Post>;

export type Post = {
  id: string;
  title: string;
  author: string;
  authorImage: string;
  createdAt: string;
  image: string;
  description: string;
  likes: number;
  comments: number;
  bookmarks: number;
};
