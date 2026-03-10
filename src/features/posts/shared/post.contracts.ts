import type { PaginatedResponse } from '@/types/pagination';
import type { CreatePostFieldErrors } from '@/features/posts/shared/create-post.rules';

export type AuthorDto = {
  id: string;
  username: string;
  name: string;
  image: string | null;
};

export type PostSummaryDto = {
  id: number;
  title: string;
  slug: string;
  authorId: string;
  author: AuthorDto;
  createdAt: string;
  updatedAt: string;
  thumbnail: string | null;
  description: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
};

export type PostListApiResponse = PaginatedResponse<PostSummaryDto>;

export type CreatePostInput = {
  title: string;
  body: unknown;
  description?: string;
  tags?: unknown;
};

export type CreatePostErrors = CreatePostFieldErrors;
export type CreatePostErrorCode = 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'USERNAME_REQUIRED' | 'INTERNAL_ERROR';

export type CreatePostSuccess = {
  ok: true;
  post: {
    id: number;
    slug: string;
    title: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
      name: string;
      image: string | null;
    };
  };
};

export type CreatePostFailure = {
  ok: false;
  error: {
    code: CreatePostErrorCode;
    message: string;
    fieldErrors?: CreatePostErrors;
  };
};

export type CreatePostResult = CreatePostSuccess | CreatePostFailure;
