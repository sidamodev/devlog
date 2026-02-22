import 'server-only';

import type { Block } from '@blocknote/core';
import { validateCreatePostInput } from '@/features/posts/server/create-post.schema';
import { CREATE_POST_MESSAGES } from '@/features/posts/shared/create-post.rules';
import {
  buildPostDescriptionFromBlocks,
  collectTextFromBlocks,
  countImageBlocks,
  getReadingTime,
} from '@/features/posts/shared/post-content.utils';
import type { CreatePostResult, PostListApiResponse, PostSummaryDto } from '@/features/posts/shared/post.contracts';
import type { PostDetail } from '@/features/posts/shared/post.types';
import { hashids } from '@/lib/hashid';
import { toPrismaInputJson } from '@/lib/prisma-json';
import { createPostRecord, findOrCreateDefaultAuthor, findPostById, findPostList } from './repository';

const PAGE_SIZE = 10;
const DESCRIPTION_MAX_LENGTH = 160;

/**
 * 커서 문자열(hashids)을 post id로 변환합니다.
 *
 * @param cursor - 클라이언트가 전달한 커서 문자열
 * @returns 유효한 경우 post id, 아니면 `undefined`
 */
const decodeCursor = (cursor?: string | null): number | undefined => {
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

/**
 * 게시글 목록 응답 DTO를 생성합니다.
 * 커서 기반 페이징을 수행하고 Date 필드를 ISO 문자열로 직렬화합니다.
 *
 * @param rawCursor - 요청 쿼리에서 받은 원본 커서 문자열
 * @returns 목록 데이터와 페이지 정보를 포함한 API 응답
 */
export const getPostListResponse = async (rawCursor?: string): Promise<PostListApiResponse> => {
  const cursor = decodeCursor(rawCursor);
  const posts = await findPostList(cursor, PAGE_SIZE);

  const hasNextPage = posts.length > PAGE_SIZE;
  const currentPage = hasNextPage ? posts.slice(0, PAGE_SIZE) : posts;

  const data: PostSummaryDto[] = currentPage.map((post) => ({
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

/**
 * 게시글 생성 요청을 검증하고 저장한 뒤 API 계약 형태의 결과를 반환합니다.
 * 입력 검증 실패 시 `VALIDATION_ERROR`, 처리 중 예외 발생 시 `INTERNAL_ERROR`를 반환합니다.
 *
 * @param input - 클라이언트/액션 계층에서 전달된 게시글 생성 원본 입력값
 * @returns 생성 성공 시 게시글 메타 정보, 실패 시 에러 코드/메시지를 포함한 결과
 */
export const createPost = async (input: unknown): Promise<CreatePostResult> => {
  try {
    const validated = validateCreatePostInput(input);
    if (!validated.success) {
      return {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: CREATE_POST_MESSAGES.invalidInput,
          fieldErrors: validated.fieldErrors,
        },
      };
    }

    const { title, body } = validated.data;
    const plainText = collectTextFromBlocks(body);
    const description = buildPostDescriptionFromBlocks(body, DESCRIPTION_MAX_LENGTH);
    const author = await findOrCreateDefaultAuthor();
    const imageCount = countImageBlocks(body);
    const sanitizedBody = toPrismaInputJson(body);
    const created = await createPostRecord({
      authorId: author.id,
      slug: toSlug(title),
      title,
      description,
      body: sanitizedBody,
      readingTime: getReadingTime(plainText, imageCount),
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
      error: {
        code: 'INTERNAL_ERROR',
        message: CREATE_POST_MESSAGES.internalError,
      },
    };
  }
};
