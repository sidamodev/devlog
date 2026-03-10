type UsernameSource = {
  id: string;
  email?: string | null;
  name?: string | null;
};

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;

export const USERNAME_MESSAGES = {
  required: '사용할 아이디를 입력해주세요.',
  tooShort: `아이디는 ${USERNAME_MIN_LENGTH}자 이상이어야 합니다.`,
  tooLong: `아이디는 ${USERNAME_MAX_LENGTH}자 이하여야 합니다.`,
  taken: '이미 사용 중인 아이디입니다.',
  authRequired: '로그인 후 아이디를 설정할 수 있습니다.',
  alreadySet: '이미 아이디가 설정되어 있습니다.',
  submitFailed: '아이디를 저장하지 못했습니다. 다시 시도해주세요.',
} as const;

export const normalizeUsername = (value: string): string =>
  value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const toSuggestedUsername = (value: string): string => {
  const normalized = normalizeUsername(value);

  if (!normalized) {
    return 'user';
  }

  return normalized.length >= USERNAME_MIN_LENGTH ? normalized : `user-${normalized}`;
};

export const buildUsernameBaseCandidates = ({ id, email, name }: UsernameSource): string[] => {
  const emailLocalPart = email?.split('@')[0];
  const candidates = [emailLocalPart, name, `user-${id.slice(0, 8)}`, 'user'];

  return [...new Set(candidates.filter(Boolean).map((candidate) => toSuggestedUsername(candidate as string)))];
};

export const validateUsername = (value: string) => {
  const normalized = normalizeUsername(value);

  if (!normalized) {
    return {
      ok: false as const,
      normalized,
      message: USERNAME_MESSAGES.required,
    };
  }

  if (normalized.length < USERNAME_MIN_LENGTH) {
    return {
      ok: false as const,
      normalized,
      message: USERNAME_MESSAGES.tooShort,
    };
  }

  if (normalized.length > USERNAME_MAX_LENGTH) {
    return {
      ok: false as const,
      normalized,
      message: USERNAME_MESSAGES.tooLong,
    };
  }

  return {
    ok: true as const,
    normalized,
  };
};
