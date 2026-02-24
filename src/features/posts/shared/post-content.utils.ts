import type { Block } from '@blocknote/core';

const DEFAULT_KOREAN_WPM = 100;
const DEFAULT_ENGLISH_WPM = 200;
const DEFAULT_IMAGE_TIME_SECONDS = 30;
const DEFAULT_DESCRIPTION_MAX_LENGTH = 160;

/**
 * {@link getReadingTime}에 전달할 읽기 속도 옵션.
 *
 * @property koreanWPM - 한국어 읽기 속도 (분당 단어 수). 기본값: 100
 * @property englishWPM - 영어 읽기 속도 (분당 단어 수). 기본값: 200
 * @property imageTimeSeconds - 이미지 1장당 추가되는 읽기 시간(초). 기본값: 30
 */
export type ReadingTimeOptions = {
  koreanWPM?: number;
  englishWPM?: number;
  imageTimeSeconds?: number;
};

/**
 * {@link collectTextFromBlocks}에 전달할 텍스트 수집 옵션.
 *
 * @property includeBlockTypes - 텍스트를 수집할 블록 타입 목록.
 *   지정하지 않으면 모든 블록 타입에서 텍스트를 수집합니다.
 */
export type CollectTextFromBlocksOptions = {
  includeBlockTypes?: ReadonlyArray<Block['type']>;
};

// ---------------------------------------------------------------------------
// Grapheme helpers
// ---------------------------------------------------------------------------

/**
 * 텍스트를 grapheme cluster 단위로 분리합니다.
 *
 * `Intl.Segmenter`를 지원하는 환경에서는 한국어 음절 등 다중 코드포인트 문자를
 * 정확하게 분리합니다. 미지원 환경에서는 `Array.from`으로 폴백합니다.
 *
 * @param text - 분리할 텍스트
 * @returns grapheme cluster 배열
 */
const segmentGraphemes = (text: string): string[] => {
  if (typeof Intl?.Segmenter !== 'undefined') {
    const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

/**
 * 텍스트를 grapheme cluster 기준으로 앞에서부터 `maxLength`개만큼 잘라 반환합니다.
 *
 * @param text - 자를 텍스트
 * @param maxLength - 유지할 최대 grapheme cluster 수
 * @returns 잘린 텍스트
 */
const sliceByGrapheme = (text: string, maxLength: number): string =>
  segmentGraphemes(text).slice(0, maxLength).join('');

// ---------------------------------------------------------------------------
// Number helpers
// ---------------------------------------------------------------------------

/**
 * `value`가 유한한 양수이면 그대로 반환하고, 아니면 `fallback`을 반환합니다.
 *
 * @param value - 검사할 값
 * @param fallback - 유효하지 않을 때 사용할 기본값
 * @returns 유효한 양수 또는 `fallback`
 */
const clampPositive = (value: number | undefined, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;

// ---------------------------------------------------------------------------
// Text extraction
// ---------------------------------------------------------------------------

/**
 * BlockNote 인라인 콘텐츠(`content` 필드)에서 순수 텍스트를 추출합니다.
 *
 * 문자열이면 그대로 반환하고, `{ text: string }` 형태의 인라인 노드 배열이면
 * 각 `text` 값을 이어붙여 반환합니다. 인식할 수 없는 형태이면 빈 문자열을 반환합니다.
 *
 * @param content - 블록의 `content` 필드 값
 * @returns 추출된 순수 텍스트
 */
const collectInlineText = (content: unknown): string => {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';

  return content
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'text' in item) {
        const { text } = item as { text?: unknown };
        return typeof text === 'string' ? text : '';
      }
      return '';
    })
    .join('');
};

/**
 * 연속된 공백 문자를 단일 공백으로 정규화하고 앞뒤 공백을 제거합니다.
 *
 * @param text - 정규화할 텍스트
 * @returns 정규화된 텍스트
 */
const normalizeWhitespace = (text: string): string => text.replace(/\s+/g, ' ').trim();

/**
 * 블록 트리를 재귀적으로 순회하며 텍스트를 수집합니다.
 *
 * `filter`가 주어지면 해당 타입의 블록에서만 텍스트를 추출하고,
 * `undefined`이면 모든 블록에서 추출합니다.
 * 중첩 블록(`children`)은 항상 재귀적으로 처리됩니다.
 *
 * @param blocks - 순회할 블록 배열
 * @param filter - 텍스트를 수집할 블록 타입 집합. `undefined`이면 전체 수집
 * @returns 공백으로 연결된 텍스트
 */
const collectTextRecursive = (blocks: Block[], filter: ReadonlySet<Block['type']> | undefined): string =>
  blocks
    .map((block) => {
      const type = (block as { type?: unknown }).type as Block['type'] | undefined;
      const includeText = !filter || (type !== undefined && filter.has(type));
      const text = includeText ? collectInlineText((block as { content?: unknown }).content) : '';

      const children = (block as { children?: unknown }).children;
      if (Array.isArray(children) && children.length > 0) {
        return [text, collectTextRecursive(children as Block[], filter)].filter(Boolean).join(' ');
      }

      return text;
    })
    .join(' ');

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * 블록 배열에서 순수 텍스트를 수집하고 공백을 정규화하여 반환합니다.
 *
 * `options.includeBlockTypes`를 지정하면 해당 타입의 블록에서만 텍스트를 수집합니다.
 * 지정하지 않으면 모든 블록 타입에서 수집합니다.
 * 중첩 블록도 재귀적으로 처리됩니다.
 *
 * @param blocks - 텍스트를 수집할 블록 배열
 * @param options - 수집 옵션
 * @returns 공백이 정규화된 순수 텍스트
 *
 * @example
 * ```ts
 * const text = collectTextFromBlocks(body, { includeBlockTypes: ['paragraph'] });
 * ```
 */
export const collectTextFromBlocks = (blocks: Block[], options: CollectTextFromBlocksOptions = {}): string => {
  const filter =
    options.includeBlockTypes && options.includeBlockTypes.length > 0
      ? new Set(options.includeBlockTypes)
      : undefined;

  return normalizeWhitespace(collectTextRecursive(blocks, filter));
};

/**
 * 블록 트리에서 이미지 블록의 수를 셉니다.
 *
 * 중첩 블록(`children`)을 재귀적으로 순회하여 모든 깊이의 이미지를 포함합니다.
 *
 * @param blocks - 순회할 블록 배열
 * @returns 이미지 블록의 총 개수
 */
export const countImageBlocks = (blocks: Block[]): number =>
  blocks.reduce((count, block) => {
    const isImage = (block as { type?: unknown }).type === 'image' ? 1 : 0;
    const children = (block as { children?: unknown }).children;
    const nested = Array.isArray(children) ? countImageBlocks(children as Block[]) : 0;
    return count + isImage + nested;
  }, 0);

/**
 * 블록 배열에서 게시글 설명(description) 문자열을 생성합니다.
 *
 * 전체 블록에서 텍스트를 수집한 뒤 `maxLength` grapheme 단위로 절단합니다.
 * 자동 생성된 description에는 호출 측에서 ellipsis(`…`)를 붙여야 합니다.
 *
 * @param blocks - 설명을 생성할 블록 배열
 * @param maxLength - 설명의 최대 grapheme 수. 기본값: 160
 * @returns 최대 `maxLength` grapheme 이내의 설명 문자열. 텍스트가 없으면 빈 문자열
 */
export const buildPostDescriptionFromBlocks = (blocks: Block[], maxLength = DEFAULT_DESCRIPTION_MAX_LENGTH): string => {
  const source = collectTextFromBlocks(blocks);
  return sliceByGrapheme(source, clampPositive(maxLength, DEFAULT_DESCRIPTION_MAX_LENGTH));
};

/**
 * 텍스트와 이미지 수를 바탕으로 예상 읽기 시간(분)을 계산합니다.
 *
 * 한국어·영어 문자 비율에 따라 평균 읽기 속도를 가중 평균으로 산출하고,
 * 이미지 1장당 고정 시간을 더해 전체 소요 시간을 구합니다.
 * 최소 반환값은 1분입니다.
 *
 * @param text - 읽기 시간을 계산할 순수 텍스트
 * @param imageCount - 콘텐츠에 포함된 이미지 수. 기본값: 0
 * @param options - 읽기 속도 커스터마이징 옵션
 * @returns 올림 처리된 예상 읽기 시간(분), 최소 1
 *
 * @example
 * ```ts
 * const minutes = getReadingTime(plainText, countImageBlocks(body));
 * ```
 */
export const getReadingTime = (text: string, imageCount = 0, options: ReadingTimeOptions = {}): number => {
  const koreanWPM = clampPositive(options.koreanWPM, DEFAULT_KOREAN_WPM);
  const englishWPM = clampPositive(options.englishWPM, DEFAULT_ENGLISH_WPM);
  const imageTimeSeconds = clampPositive(options.imageTimeSeconds, DEFAULT_IMAGE_TIME_SECONDS);

  const trimmed = text.trim();
  const korChars = (trimmed.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) ?? []).length;
  const engChars = (trimmed.match(/[a-zA-Z]/g) ?? []).length;
  const total = korChars + engChars;
  const avgWPM = total > 0 ? (koreanWPM * korChars + englishWPM * engChars) / total : koreanWPM;

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const textSeconds = wordCount > 0 ? (wordCount / avgWPM) * 60 : 0;

  return Math.max(1, Math.ceil((textSeconds + imageCount * imageTimeSeconds) / 60));
};