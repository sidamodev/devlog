// block-utils.tsx
import { Block } from '@blocknote/core';
import { InlineContent } from './inline-content';

export const readString = (value: unknown): string | undefined => 
  typeof value === 'string' && value.length > 0 ? value : undefined;

export const readNumber = (value: unknown): number | undefined => 
  typeof value === 'number' ? value : undefined;

export const readBoolean = (value: unknown): boolean | undefined => 
  typeof value === 'boolean' ? value : undefined;

export const renderInlineOrText = (value: unknown) => {
  if (Array.isArray(value)) {
    return <InlineContent content={value as Block['content']} />;
  }
  if (typeof value === 'string') {
    return value;
  }
  return null;
};

export const extractTextFromContent = (content: unknown): string => {
  if (!Array.isArray(content)) return '';
  
  return content
    .map((item) => (item.type === 'text' ? item.text : ''))
    .join('');
};
