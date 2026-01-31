import { Block } from '@blocknote/core';
import React from 'react';
import { InlineContent } from './inline-content';
import { CodeBlock } from '@/components/code-block/code-block';
import Image from 'next/image';

export type GroupedBlock = Block | { type: 'list-group'; listType: string; items: Block[] };

/**
 * 인접한 리스트 아이템을 하나의 그룹으로 묶어줍니다.
 * 렌더링 단계에서 복잡한 while 루프를 제거하기 위함입니다.
 */
export function groupBlocks(blocks: Block[]): GroupedBlock[] {
  const result: GroupedBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === 'bulletListItem' || block.type === 'numberedListItem') {
      const listType = block.type;
      const listItems: Block[] = [];

      while (i < blocks.length && blocks[i].type === listType) {
        listItems.push(blocks[i]);
        i++;
      }

      result.push({
        type: 'list-group',
        listType,
        items: listItems,
      });
    } else {
      result.push(block);
      i++;
    }
  }

  return result;
}
interface BlockRendererProps {
  blocks: Block[];
}

export async function BlockRenderer({ blocks }: BlockRendererProps) {
  const groupedBlocks = groupBlocks(blocks);

  return (
    <div className="space-y-4">
      {groupedBlocks.map((block, index) => {
        // block.id가 없는 가상 그룹일 수 있으므로 index를 키로 활용하거나 고유 ID 생성
        const key = 'id' in block ? block.id : `group-${index}`;
        return <BlockSelector key={key} block={block} />;
      })}
    </div>
  );
}

// ----------------------------------------------------------------------
// 개별 블록 렌더러 (파일 분리 권장)
// ----------------------------------------------------------------------

function BlockSelector({ block }: { block: GroupedBlock }) {
  // 1. 리스트 그룹 처리
  if ('type' in block && block.type === 'list-group') {
    // 타입 단언을 안전하게 처리
    const listBlock = block as { listType: string; items: Block[] };
    const ListTag = listBlock.listType === 'bulletListItem' ? 'ul' : 'ol';

    return (
      <ListTag>
        {listBlock.items.map((item) => (
          <li key={item.id}>
            <InlineContent content={item.content} />
            {item.children.length > 0 && (
              /* 재귀 호출 */
              <div className="mt-1">
                <BlockRenderer blocks={item.children} />
              </div>
            )}
          </li>
        ))}
      </ListTag>
    );
  }

  // 2. 일반 블록 처리
  const standardBlock = block as Block;

  switch (standardBlock.type) {
    case 'heading': {
      // 레벨 제한 (h1~h6)
      const level = Math.min((standardBlock.props.level as number) || 1, 6);
      const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

      return (
        <Tag id={standardBlock.id}>
          <InlineContent content={standardBlock.content} />
        </Tag>
      );
    }

    case 'paragraph': {
      // 특수 케이스: Divider & Quote (기존 로직 유지)
      if (standardBlock.id === 'divider') return <hr />;
      if (standardBlock.id === 'quote') {
        return (
          <blockquote>
            <p>
              <InlineContent content={standardBlock.content} />
            </p>
          </blockquote>
        );
      }
      return (
        <p>
          <InlineContent content={standardBlock.content} />
        </p>
      );
    }

    case 'codeBlock': {
      let code = '';
      if (Array.isArray(standardBlock.content)) {
        code = standardBlock.content.map((item) => (item.type === 'text' ? item.text : '')).join('');
      }
      return <CodeBlock code={code} language={standardBlock.props.language as string} />;
    }

    case 'image':
      return (
        <figure>
          <Image
            src={standardBlock.props.url}
            alt="Code on a computer screen"
            className="w-full object-cover aspect-2/1"
            width={standardBlock.props.previewWidth}
            height={768}
          />
          <figcaption className="text-center text-sm">{standardBlock.props.caption}</figcaption>
        </figure>
      );

    default:
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown block type: ${standardBlock.type}`);
      }
      return null;
  }
}
