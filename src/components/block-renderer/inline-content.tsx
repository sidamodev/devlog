import { Block } from '@blocknote/core';
import Link from 'next/link';
import React from 'react';

// 스타일 렌더러 정의
const STYLE_RENDERERS: Record<string, (children: React.ReactNode) => React.ReactNode> = {
  bold: (c) => <strong className="font-bold">{c}</strong>,
  italic: (c) => <em className="italic">{c}</em>,
  underline: (c) => <u className="underline">{c}</u>,
  strike: (c) => <s className="line-through">{c}</s>,
  code: (c) => (
    <code className="rounded px-1 py-0.5 font-mono text-sm whitespace-normal bg-accent text-accent-foreground">
      {c}
    </code>
  ),
};

interface InlineContentProps {
  content: Block['content'];
}

export function InlineContent({ content }: InlineContentProps) {
  if (!Array.isArray(content)) return null;

  return (
    <>
      {content.map((item, index) => {
        if (item.type === 'link') {
          return (
            <Link key={index} href={item.href} className="text-blue-600 hover:underline">
              {/* 재귀적으로 호출하거나 텍스트만 렌더링 */}
              {Array.isArray(item.content) ? <InlineContent content={item.content} /> : item.content}
            </Link>
          );
        }

        // 일반 텍스트 + 스타일 적용
        let element: React.ReactNode = item.text;

        // item.styles가 존재하면 순회하며 래핑
        if (item.styles) {
          (Object.keys(item.styles) as Array<keyof typeof STYLE_RENDERERS>).forEach((style) => {
            const renderer = STYLE_RENDERERS[style];
            if (renderer && item.styles?.[style as keyof typeof item.styles]) {
              element = renderer(element);
            }
          });
        }

        return <React.Fragment key={index}>{element}</React.Fragment>;
      })}
    </>
  );
}
