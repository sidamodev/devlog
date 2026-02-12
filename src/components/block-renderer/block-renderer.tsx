// block-renderer.tsx
import type { Block } from '@blocknote/core';
import React from 'react';
import { 
  HeadingBlock, 
  ParagraphBlock, 
  DividerBlock, 
  QuoteBlock, 
  CodeBlockRenderer,
  CheckListBlock,
  ToggleListBlock,
  TableBlock,
  ImageBlock,
  AudioBlock,
  VideoBlock,
  FileBlock,
  ListGroupBlock
} from './block-types';

export type ListGroup = { 
  type: 'list-group'; 
  listType: 'bulletListItem' | 'numberedListItem'; 
  items: Block[] 
};

export type GroupedBlock = Block | ListGroup;
type BlockType = Block['type'];
export type BlockOf<T extends BlockType> = Extract<Block, { type: T }>;

interface BlockRendererProps {
  blocks: Block[];
}

type RendererMap = {
  [K in BlockType]?: React.ComponentType<{ block: BlockOf<K> }>;
};

const BLOCK_RENDERERS = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  divider: DividerBlock,
  quote: QuoteBlock,
  codeBlock: CodeBlockRenderer,
  checkListItem: CheckListBlock,
  toggleListItem: ToggleListBlock,
  table: TableBlock,
  image: ImageBlock,
  audio: AudioBlock,
  video: VideoBlock,
  file: FileBlock,
} satisfies RendererMap;

const hasRenderer = (type: BlockType): type is keyof typeof BLOCK_RENDERERS => type in BLOCK_RENDERERS;

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

export function BlockRenderer({ blocks }: BlockRendererProps) {
  const groupedBlocks = groupBlocks(blocks);

  return (
    <div className="space-y-4">
      {groupedBlocks.map((block, index) => {
        const key = 'id' in block ? block.id : `group-${index}`;
        return <BlockSelector key={key} block={block} />;
      })}
    </div>
  );
}

function BlockSelector({ block }: { block: GroupedBlock }) {
  // 리스트 그룹 처리
  if ('type' in block && block.type === 'list-group') {
    return <ListGroupBlock block={block as ListGroup} />;
  }

  const standardBlock = block as Block;
  if (!hasRenderer(standardBlock.type)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Unknown block type: ${standardBlock.type}`);
    }

    return null;
  }

  const BlockComponent = BLOCK_RENDERERS[standardBlock.type];

  // 등록된 렌더러가 있으면 사용
  const TypedBlockComponent = BlockComponent as React.ComponentType<{ block: typeof standardBlock }>;
  return <TypedBlockComponent block={standardBlock} />;
}
