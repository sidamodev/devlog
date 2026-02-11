import { PaginatedResponse } from '@/types/pagination';
import { Block } from '@blocknote/core';

export type PostListResponse = PaginatedResponse<PostSummary>;

export type PostSummary = {
  id: number;
  title: string;
  slug: string;
  authorId: number;
  author: Author;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  description: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
  readingTime: number;
  content: unknown[];
};

export type Author = {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
};

export type PostDetail = PostSummary & {
  content: Block[]; // Markdown 또는 HTML 본문
  relatedPosts?: PostSummary[]; // (선택사항) 연관 게시글 추천 등
};
