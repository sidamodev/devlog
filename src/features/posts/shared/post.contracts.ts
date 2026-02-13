import type { PaginatedResponse } from '@/types/pagination';

export type AuthorDto = {
  id: number;
  username: string;
  nickname: string;
  avatar: string | null;
};

export type PostSummaryDto = {
  id: number;
  title: string;
  slug: string;
  authorId: number;
  author: AuthorDto;
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

export type PostListApiResponse = PaginatedResponse<PostSummaryDto>;
