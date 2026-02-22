import type { PostListResponse, PostSummary } from '@/features/posts/shared/post.types';
import { PostListApiResponse, PostSummaryDto } from './post.contracts';

/**
 * API DTO 형태의 게시글 목록 응답을 UI/도메인 타입으로 변환합니다.
 *
 * 서버/JSON 계층에서 `null`로 내려오는 작성자 아바타 값을
 * 클라이언트 모델의 optional 규칙에 맞게 `undefined`로 정규화합니다.
 *
 * @param response - `/posts` API에서 받은 원본 목록 응답 DTO
 * @returns 화면 계층에서 사용하는 게시글 목록 응답
 */
export const mapPostDtoToSummary = (response: PostListApiResponse): PostListResponse => {
  return {
    ...response,
    data: response.data.map(
      (post: PostSummaryDto): PostSummary => ({
        ...post,
        author: {
          ...post.author,
          avatar: post.author.avatar ?? undefined,
        },
      }),
    ),
  } satisfies PostListResponse;
};
