import type { Block } from '@blocknote/core';
import type { PaginatedResponse } from '@/types/pagination';

export type Author = {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
};

export type PostSummary = {
  id: number;
  title: string;
  slug: string;
  authorId: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
  thumbnail: string | null;
  description: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  readingTime: number;
  body: unknown;
};

export type PostListResponse = PaginatedResponse<PostSummary>;

export type PostDetail = PostSummary & {
  body: Block[];
  relatedPosts?: PostSummary[];
};
