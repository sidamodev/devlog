import 'server-only';

import type { Block } from '@blocknote/core';
import type { PostDetail } from '@/features/posts/model/types';
import { hashids } from '@/lib/hashid';
import { createPostRecord, findOrCreateDefaultAuthor, findPostById, findPostList } from './repository';
import type { Prisma } from '../../../../generated/prisma/client';

const PAGE_SIZE = 20;
const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 120;
const TAG_MAX_COUNT = 10;
const TAG_MAX_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 140;

export type CreatePostInput = {
  title: string;
  body: unknown;
  tags?: unknown;
};

export type CreatePostErrors = {
  title?: string;
  body?: string;
  tags?: string;
};

export type CreatePostSuccess =
  | {
      ok: true;
      post: {
        id: number;
        slug: string;
        title: string;
        createdAt: string;
        author: {
          id: number;
          username: string;
          nickname: string;
          avatar: string | null;
        };
      };
    };

export type CreatePostFailure =
  | {
      ok: false;
      status: 400 | 500;
      message: string;
      errors?: CreatePostErrors;
    };

export type CreatePostResult = CreatePostSuccess | CreatePostFailure;

type PostListApiRecord = {
  id: number;
  title: string;
  slug: string;
  authorId: number;
  author: {
    id: number;
    username: string;
    nickname: string;
    avatar: string | null;
  };
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

type PostListApiResponse = {
  data: PostListApiRecord[];
  pageInfo: {
    nextCursor?: string;
    hasNextPage: boolean;
    count: number;
  };
};

/**
 * 커서 문자열(hashids)을 post id로 변환합니다.
 *
 * @param cursor - 클라이언트가 전달한 커서 문자열
 * @returns 유효한 경우 post id, 아니면 `undefined`
 */
const decodeCursor = (cursor: string | null): number | undefined => {
  if (!cursor) return undefined;

  try {
    const decoded = hashids.decode(cursor);
    const raw = decoded[0];
    const id = typeof raw === 'bigint' ? Number(raw) : typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isInteger(id) || id <= 0) return undefined;
    return id;
  } catch {
    return undefined;
  }
};

/**
 * post id를 다음 페이지 요청에 사용할 커서 문자열로 변환합니다.
 *
 * @param id - 게시글 id
 * @returns hashids로 인코딩된 커서 문자열
 */
const encodeCursor = (id: number): string => hashids.encode(id);

const isBlockArray = (value: unknown): value is Block[] => {
  if (!Array.isArray(value)) return false;
  return value.every((item) => typeof item === 'object' && item !== null);
};

const collectTextFromInline = (content: unknown): string => {
  if (typeof content === 'string') {
    return content;
  }

  if (!Array.isArray(content)) {
    return '';
  }

  return content
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'text' in item) {
        const text = (item as { text?: unknown }).text;
        return typeof text === 'string' ? text : '';
      }
      return '';
    })
    .join(' ');
};

const collectTextFromBlocks = (blocks: Block[]): string => {
  return blocks
    .map((block) => {
      const currentText = collectTextFromInline((block as { content?: unknown }).content);
      const children = (block as { children?: unknown }).children;
      if (Array.isArray(children) && children.length > 0) {
        return [currentText, collectTextFromBlocks(children as Block[])].join(' ');
      }
      return currentText;
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const toSlug = (title: string): string => {
  const normalized = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized.length > 0 ? normalized : 'post';
};

const sanitizeTags = (input: unknown): string[] => {
  if (input === undefined) return [];
  if (!Array.isArray(input)) return [];

  const normalized = input
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  return Array.from(new Set(normalized));
};

const getReadingTime = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / 225));
};

const toInputJson = (value: unknown): Prisma.InputJsonValue => value as Prisma.InputJsonValue;

const validateCreatePostInput = (input: CreatePostInput) => {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const body = input.body;
  const tags = sanitizeTags(input.tags);
  const errors: CreatePostErrors = {};

  if (title.length < TITLE_MIN_LENGTH) {
    errors.title = '제목은 필수 입력값입니다.';
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `제목은 ${TITLE_MAX_LENGTH}자 이하로 입력해주세요.`;
  }

  if (!isBlockArray(body)) {
    errors.body = '본문 형식이 올바르지 않습니다.';
  }

  const plainText = isBlockArray(body) ? collectTextFromBlocks(body) : '';
  if (!plainText) {
    errors.body = '본문은 필수 입력값입니다.';
  }

  if (tags.length > TAG_MAX_COUNT) {
    errors.tags = `태그는 최대 ${TAG_MAX_COUNT}개까지 입력할 수 있습니다.`;
  } else if (tags.some((tag) => tag.length > TAG_MAX_LENGTH)) {
    errors.tags = `태그는 ${TAG_MAX_LENGTH}자 이하로 입력해주세요.`;
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    title,
    body: isBlockArray(body) ? body : [],
    tags,
    plainText,
  };
};

const normalizeCreatePostInput = (input: unknown): CreatePostInput => {
  if (!input || typeof input !== 'object') {
    return { title: '', body: undefined };
  }

  return {
    title: typeof (input as { title?: unknown }).title === 'string' ? (input as { title: string }).title : '',
    body: (input as { body?: unknown }).body,
    tags: (input as { tags?: unknown }).tags,
  };
};

/**
 * 게시글 목록 응답 DTO를 생성합니다.
 * 커서 기반 페이징을 수행하고 Date 필드를 ISO 문자열로 직렬화합니다.
 *
 * @param rawCursor - 요청 쿼리에서 받은 원본 커서 문자열
 * @returns 목록 데이터와 페이지 정보를 포함한 API 응답
 */
export const getPostListResponse = async (rawCursor: string | null): Promise<PostListApiResponse> => {
  const cursor = decodeCursor(rawCursor);
  const posts = await findPostList(cursor, PAGE_SIZE);

  const hasNextPage = posts.length > PAGE_SIZE;
  const currentPage = hasNextPage ? posts.slice(0, PAGE_SIZE) : posts;

  const data: PostListApiRecord[] = currentPage.map((post) => ({
    ...post,
    slug: post.slug + '-' + hashids.encode(post.id),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));

  const nextCursor = hasNextPage ? encodeCursor(currentPage[currentPage.length - 1].id) : undefined;

  return {
    data,
    pageInfo: {
      nextCursor,
      hasNextPage,
      count: data.length,
    },
  };
};

/**
 * slug의 마지막 토큰(hashids)으로 게시글 상세를 조회합니다.
 * 조회 성공 시 화면 모델(PostDetail)로 정규화해서 반환합니다.
 *
 * @param slug - 게시글 slug (`{slugText}-{hashid}` 형식)
 * @returns 조회 성공 시 상세 데이터, 실패 시 `null`
 */
export const getPostDetail = async (slug: string): Promise<PostDetail | null> => {
  const hashPart = slug.split('-').pop();
  if (!hashPart) {
    return Promise.resolve(null);
  }

  const decoded = hashids.decode(hashPart);
  const postId = decoded[0];
  if (postId === undefined || typeof postId !== 'number') {
    return Promise.resolve(null);
  }

  const post = await findPostById(postId);
  if (!post) {
    return Promise.resolve(null);
  }

  return Promise.resolve({
    ...post,
    author: {
      ...post.author,
      avatar: post.author.avatar ?? undefined,
    },
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    body: post.body as Block[],
  });
};

export const createPost = async (input: unknown): Promise<CreatePostResult> => {
  try {
    const validated = validateCreatePostInput(normalizeCreatePostInput(input));
    if (!validated.isValid) {
      return {
        ok: false,
        status: 400,
        message: '입력값을 확인해주세요.',
        errors: validated.errors,
      };
    }

    const author = await findOrCreateDefaultAuthor();
    const created = await createPostRecord({
      authorId: author.id,
      slug: toSlug(validated.title),
      title: validated.title,
      description: validated.plainText.slice(0, DESCRIPTION_MAX_LENGTH),
      body: toInputJson(validated.body),
      readingTime: getReadingTime(validated.plainText),
    });

    return {
      ok: true,
      post: {
        id: created.id,
        slug: `${created.slug}-${hashids.encode(created.id)}`,
        title: created.title,
        createdAt: created.createdAt.toISOString(),
        author: {
          id: created.author.id,
          username: created.author.username,
          nickname: created.author.nickname,
          avatar: created.author.avatar,
        },
      },
    };
  } catch {
    return {
      ok: false,
      status: 500,
      message: '게시글 등록 중 오류가 발생했습니다.',
    };
  }
};
