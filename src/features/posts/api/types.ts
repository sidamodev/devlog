import { PaginatedResponse } from '@/types/pagination';
import { Block } from '@blocknote/core';

export type PostListResponse = PaginatedResponse<PostSummary>;

export type PostSummary = {
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

export type PostDetail = PostSummary & {
  readingTime: number;
  content: Block[]; // Markdown 또는 HTML 본문
  relatedPosts?: PostSummary[]; // (선택사항) 연관 게시글 추천 등
};
