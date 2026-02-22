import type { Block } from '@blocknote/core';

const DEFAULT_KOREAN_WPM = 100;
const DEFAULT_ENGLISH_WPM = 200;
const DEFAULT_IMAGE_TIME_SECONDS = 30;
const DEFAULT_DESCRIPTION_MAX_LENGTH = 160;

const DESCRIPTION_PREFERRED_BLOCK_TYPES: Block['type'][] = [
  'heading',
  'paragraph',
  'quote',
  'bulletListItem',
  'numberedListItem',
  'checkListItem',
  'toggleListItem',
];

export type ReadingTimeOptions = {
  koreanWPM?: number;
  englishWPM?: number;
  imageTimeSeconds?: number;
};

export type CollectTextFromBlocksOptions = {
  includeBlockTypes?: ReadonlyArray<Block['type']>;
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
    .join('');
};

const normalizeWhitespace = (text: string): string => text.replace(/\s+/g, ' ').trim();

const getIncludeBlockTypeSet = (includeBlockTypes: CollectTextFromBlocksOptions['includeBlockTypes']) => {
  if (!includeBlockTypes || includeBlockTypes.length === 0) {
    return undefined;
  }

  return new Set(includeBlockTypes);
};

const collectTextFromBlocksInternal = (blocks: Block[], includeBlockTypes: Set<Block['type']> | undefined): string => {
  return blocks
    .map((block) => {
      const blockType = (block as { type?: unknown }).type;
      const shouldIncludeCurrentText =
        !includeBlockTypes || (typeof blockType === 'string' && includeBlockTypes.has(blockType as Block['type']));
      const currentText = shouldIncludeCurrentText
        ? collectTextFromInline((block as { content?: unknown }).content)
        : '';
      const children = (block as { children?: unknown }).children;

      if (Array.isArray(children) && children.length > 0) {
        return [currentText, collectTextFromBlocksInternal(children as Block[], includeBlockTypes)]
          .filter(Boolean)
          .join(' ');
      }

      return currentText;
    })
    .join(' ');
};

const getPositiveOrDefault = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
};

const getPositiveIntegerOrDefault = (value: number | undefined, fallback: number): number => {
  const normalized = getPositiveOrDefault(value, fallback);
  return Math.floor(normalized);
};

const splitByGrapheme = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter !== 'undefined') {
    const segmenter = new Intl.Segmenter('ko', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }

  return Array.from(text);
};

const getGraphemeLength = (text: string): number => splitByGrapheme(text).length;

const sliceByGrapheme = (text: string, maxLength: number): string => splitByGrapheme(text).slice(0, maxLength).join('');

const truncateTextAtWordBoundary = (text: string, maxLength: number): string => {
  if (maxLength <= 0) {
    return '';
  }

  if (getGraphemeLength(text) <= maxLength) {
    return text;
  }

  const words = text.split(' ').filter(Boolean);
  let result = '';
  let resultLength = 0;

  for (const word of words) {
    const wordLength = getGraphemeLength(word);
    const nextLength = resultLength === 0 ? wordLength : resultLength + 1 + wordLength;

    if (nextLength > maxLength) {
      break;
    }

    result = resultLength === 0 ? word : `${result} ${word}`;
    resultLength = nextLength;
  }

  if (result.length > 0) {
    return result;
  }

  return sliceByGrapheme(text, maxLength);
};

export const collectTextFromBlocks = (blocks: Block[], options: CollectTextFromBlocksOptions = {}): string => {
  const includeBlockTypeSet = getIncludeBlockTypeSet(options.includeBlockTypes);
  const collectedText = collectTextFromBlocksInternal(blocks, includeBlockTypeSet);

  return normalizeWhitespace(collectedText);
};

export const countImageBlocks = (blocks: Block[]): number => {
  return blocks.reduce((count, block) => {
    const type = (block as { type?: unknown }).type;
    const current = type === 'image' ? 1 : 0;
    const children = (block as { children?: unknown }).children;
    const nested = Array.isArray(children) ? countImageBlocks(children as Block[]) : 0;

    return count + current + nested;
  }, 0);
};

export const buildPostDescriptionFromBlocks = (blocks: Block[], maxLength = DEFAULT_DESCRIPTION_MAX_LENGTH): string => {
  const preferredText = collectTextFromBlocks(blocks, {
    includeBlockTypes: DESCRIPTION_PREFERRED_BLOCK_TYPES,
  });
  const sourceText = preferredText || collectTextFromBlocks(blocks);
  const normalizedText = normalizeWhitespace(sourceText);
  const normalizedMaxLength = getPositiveIntegerOrDefault(maxLength, DEFAULT_DESCRIPTION_MAX_LENGTH);

  if (!normalizedText) {
    return '';
  }

  return truncateTextAtWordBoundary(normalizedText, normalizedMaxLength);
};

export const getReadingTime = (text: string, imageCount = 0, options: ReadingTimeOptions = {}): number => {
  const koreanWPM = getPositiveOrDefault(options.koreanWPM, DEFAULT_KOREAN_WPM);
  const englishWPM = getPositiveOrDefault(options.englishWPM, DEFAULT_ENGLISH_WPM);
  const imageTimeSeconds = getPositiveOrDefault(options.imageTimeSeconds, DEFAULT_IMAGE_TIME_SECONDS);

  const trimmedText = text.trim();
  const korChars = (trimmedText.match(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g) || []).length;
  const engChars = (trimmedText.match(/[a-zA-Z]/g) || []).length;
  const weightedCharCount = korChars + engChars;
  const avgWPM = weightedCharCount > 0 ? (koreanWPM * korChars + englishWPM * engChars) / weightedCharCount : koreanWPM;

  const words = trimmedText.split(/\s+/).filter(Boolean).length;
  const textTimeSeconds = words > 0 ? (words / avgWPM) * 60 : 0;
  const totalSeconds = textTimeSeconds + imageCount * imageTimeSeconds;

  return Math.max(1, Math.ceil(totalSeconds / 60));
};
