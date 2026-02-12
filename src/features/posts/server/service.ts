import 'server-only';

import type { Block } from '@blocknote/core';
import type { PostListApiResponse, PostSummaryDto } from '@/features/posts/api/dto';
import type { PostDetail } from '@/features/posts/model/types';
import { hashids } from '@/lib/hashid';
import { findPostById, findPostList } from './repository';

const PAGE_SIZE = 20;

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
