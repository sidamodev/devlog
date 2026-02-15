export const TITLE_MAX_LENGTH = 120;
export const TAG_MAX_COUNT = 10;
export const TAG_MAX_LENGTH = 20;

export const CREATE_POST_MESSAGES = {
  invalidInput: '입력값을 확인해주세요.',
  internalError: '게시글 등록 중 오류가 발생했습니다.',
  titleRequired: '제목은 필수 입력값입니다.',
  titleTooLong: `제목은 ${TITLE_MAX_LENGTH}자 이하로 입력해주세요.`,
  bodyInvalidFormat: '본문 형식이 올바르지 않습니다.',
  bodyRequired: '본문은 필수 입력값입니다.',
  tagsTooMany: `태그는 최대 ${TAG_MAX_COUNT}개까지 입력할 수 있습니다.`,
  tagsTooLong: `태그는 ${TAG_MAX_LENGTH}자 이하로 입력해주세요.`,
} as const;

export type CreatePostFieldErrors = {
  title?: string[];
  body?: string[];
  tags?: string[];
};
