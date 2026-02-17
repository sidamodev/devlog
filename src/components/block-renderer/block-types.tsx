// block-types.tsx
import { CodeBlock } from '@/components/code-block/code-block';
import Image from 'next/image';
import type { BlockOf, ListGroup } from './block-renderer';
import { BlockRenderer } from './block-renderer';
import { InlineContent } from './inline-content';

// ============================================================
// List Block
// ============================================================
export function ListGroupBlock({ block }: { block: ListGroup }) {
  const ListTag = block.listType === 'bulletListItem' ? 'ul' : 'ol';

  return (
    <ListTag>
      {block.items.map((item, index) => (
        <li key={item.id ?? `list-item-${index}`}>
          <InlineContent content={item.content} />
          {item.children && item.children.length > 0 && (
            <div className="mt-1">
              <BlockRenderer blocks={item.children} />
            </div>
          )}
        </li>
      ))}
    </ListTag>
  );
}

// ============================================================
// Text Blocks
// ============================================================
export function HeadingBlock({ block }: { block: BlockOf<'heading'> }) {
  const level = Math.min(block.props.level ?? 1, 6);
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  return (
    <Tag id={block.id}>
      <InlineContent content={block.content} />
    </Tag>
  );
}

export function ParagraphBlock({ block }: { block: BlockOf<'paragraph'> }) {
  return (
    <p>
      <InlineContent content={block.content} />
    </p>
  );
}

export function QuoteBlock({ block }: { block: BlockOf<'quote'> }) {
  return (
    <blockquote>
      <p>
        <InlineContent content={block.content} />
      </p>
    </blockquote>
  );
}

export function DividerBlock({}: { block: BlockOf<'divider'> }) {
  return <hr />;
}

// ============================================================
// Code Block
// ============================================================
export function CodeBlockRenderer({ block }: { block: BlockOf<'codeBlock'> }) {
  const code = Array.isArray(block.content)
    ? block.content.map((item) => (item.type === 'text' ? item.text : '')).join('')
    : '';

  return <CodeBlock code={code} language={block.props.language} />;
}

// ============================================================
// Interactive Blocks
// ============================================================
export function CheckListBlock({ block }: { block: BlockOf<'checkListItem'> }) {
  const checked = block.props.checked ?? false;

  return (
    <div className="flex items-start gap-2">
      <input type="checkbox" checked={checked} readOnly className="mt-1" />
      <div className="flex-1">
        <InlineContent content={block.content} />
        {block.children && block.children.length > 0 && (
          <div className="mt-1">
            <BlockRenderer blocks={block.children} />
          </div>
        )}
      </div>
    </div>
  );
}

export function ToggleListBlock({ block }: { block: BlockOf<'toggleListItem'> }) {
  return (
    <details open>
      <summary>
        <InlineContent content={block.content} />
      </summary>
      {block.children && block.children.length > 0 && (
        <div className="mt-1 pl-4">
          <BlockRenderer blocks={block.children} />
        </div>
      )}
    </details>
  );
}

// ============================================================
// Table Block
// ============================================================

export function TableBlock({ block }: { block: BlockOf<'table'> }) {
  const tableContent = block.content;
  const rows = Array.isArray(tableContent?.rows) ? tableContent.rows : [];
  const headerRows = Math.max(0, tableContent?.headerRows ?? 0);
  const headerCols = Math.max(0, tableContent?.headerCols ?? 0);

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border text-sm">
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {(row.cells ?? []).map((cell, cellIndex) => {
                const isHeader = rowIndex < headerRows || cellIndex < headerCols;
                const Tag = isHeader ? 'th' : 'td';
                const cellContent = Array.isArray(cell) ? cell : cell.content;

                return (
                  <Tag key={`cell-${rowIndex}-${cellIndex}`} className="border border-border p-2 text-left align-top">
                    <InlineContent content={cellContent} />
                  </Tag>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// Media Blocks
// ============================================================
const DEFAULT_IMAGE_WIDTH = 1024;

export function ImageBlock({ block }: { block: BlockOf<'image'> }) {
  const url = block.props.url;
  if (!url) return null;

  const caption = block.props.caption;
  const width = block.props.previewWidth ?? DEFAULT_IMAGE_WIDTH;

  return (
    <figure className="max-w-full">
      <Image
        src={url}
        alt={caption ?? 'Post image'}
        className="h-auto max-w-full object-contain"
        width={width}
        height={width}
        loading='eager'
      />
      {caption && <figcaption className="text-center text-sm">{caption}</figcaption>}
    </figure>
  );
}

export function AudioBlock({ block }: { block: BlockOf<'audio'> }) {
  const url = block.props.url;
  if (!url) return null;

  const caption = block.props.caption;
  const showPreview = block.props.showPreview ?? true;

  return (
    <figure>
      {showPreview && <audio controls src={url} className="w-full" preload="metadata" />}
      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
        {caption ?? 'Open audio'}
      </a>
    </figure>
  );
}

export function VideoBlock({ block }: { block: BlockOf<'video'> }) {
  const url = block.props.url;
  if (!url) return null;

  const caption = block.props.caption;
  const showPreview = block.props.showPreview ?? true;

  return (
    <figure>
      {showPreview && <video controls src={url} className="w-full" preload="metadata" />}
      {caption && <figcaption className="text-center text-sm">{caption}</figcaption>}
    </figure>
  );
}

export function FileBlock({ block }: { block: BlockOf<'file'> }) {
  const url = block.props.url;
  if (!url) return null;

  const name = block.props.name ?? 'Download file';
  const caption = block.props.caption;

  return (
    <figure>
      <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
        {name}
      </a>
      {caption && <figcaption className="text-center text-sm">{caption}</figcaption>}
    </figure>
  );
}
