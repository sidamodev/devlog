import type { Block } from '@blocknote/core';

const DEFAULT_KOREAN_WPM = 120;
const DEFAULT_ENGLISH_WPM = 220;
const DEFAULT_IMAGE_TIME_SECONDS = 30;

export type ReadingTimeOptions = {
  koreanWPM?: number;
  englishWPM?: number;
  imageTimeSeconds?: number;
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

export const collectTextFromBlocks = (blocks: Block[]): string => {
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

export const countImageBlocks = (blocks: Block[]): number => {
  return blocks.reduce((count, block) => {
    const type = (block as { type?: unknown }).type;
    const current = type === 'image' ? 1 : 0;
    const children = (block as { children?: unknown }).children;
    const nested = Array.isArray(children) ? countImageBlocks(children as Block[]) : 0;

    return count + current + nested;
  }, 0);
};

const getPositiveOrDefault = (value: number | undefined, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return value;
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
