import { PaginatedResponse } from '@/types/pagination';

export type PostListResponse = PaginatedResponse<Post>;

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
