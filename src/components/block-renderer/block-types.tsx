// block-types.tsx
import { Block } from '@blocknote/core';
import Image from 'next/image';
import { InlineContent } from './inline-content';
import { CodeBlock } from '@/components/code-block/code-block';
import { BlockRenderer } from './block-renderer';
import type { ListGroup } from './block-renderer';
import { readString, readNumber, readBoolean, renderInlineOrText, extractTextFromContent } from './block-utils';

const getProps = (block: Block): Record<string, unknown> => block.props as Record<string, unknown>;

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
export function HeadingBlock({ block }: { block: Block }) {
  const props = getProps(block);
  const level = Math.min((readNumber(props.level) ?? 1), 6);
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

  return (
    <Tag id={block.id}>
      <InlineContent content={block.content} />
    </Tag>
  );
}

export function ParagraphBlock({ block }: { block: Block }) {
  return (
    <p>
      <InlineContent content={block.content} />
    </p>
  );
}

export function QuoteBlock({ block }: { block: Block }) {
  return (
    <blockquote>
      <p>
        <InlineContent content={block.content} />
      </p>
    </blockquote>
  );
}

export function DividerBlock({}: { block: Block }) {
  return <hr />;
}

// ============================================================
// Code Block
// ============================================================
export function CodeBlockRenderer({ block }: { block: Block }) {
  const props = getProps(block);
  const code = extractTextFromContent(block.content);
  const language = readString(props.language) ?? '';

  return <CodeBlock code={code} language={language} />;
}

// ============================================================
// Interactive Blocks
// ============================================================
export function CheckListBlock({ block }: { block: Block }) {
  const props = getProps(block);
  const checked = readBoolean(props.checked) ?? false;

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

export function ToggleListBlock({ block }: { block: Block }) {
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
type TableContent = {
  rows?: Array<{ cells?: unknown[] }>;
  headerRows?: number;
  headerCols?: number;
};

export function TableBlock({ block }: { block: Block }) {
  const tableContent = block.content as TableContent | undefined;
  const rows = Array.isArray(tableContent?.rows) ? tableContent.rows : [];
  const headerRows = Math.max(0, readNumber(tableContent?.headerRows) ?? 0);
  const headerCols = Math.max(0, readNumber(tableContent?.headerCols) ?? 0);

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
                const cellContent = getCellContent(cell);

                return (
                  <Tag 
                    key={`cell-${rowIndex}-${cellIndex}`} 
                    className="border border-border p-2 text-left align-top"
                  >
                    {renderInlineOrText(cellContent)}
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

function getCellContent(cell: unknown) {
  return cell && typeof cell === 'object' && 'content' in cell 
    ? (cell as { content?: unknown }).content 
    : cell;
}

// ============================================================
// Media Blocks
// ============================================================
const DEFAULT_IMAGE_WIDTH = 1024;
const DEFAULT_IMAGE_HEIGHT = 768;

export function ImageBlock({ block }: { block: Block }) {
  const props = getProps(block);
  const url = readString(props.url);
  if (!url) return null;

  const caption = readString(props.caption);
  const width = readNumber(props.previewWidth) ?? DEFAULT_IMAGE_WIDTH;

  return (
    <figure>
      <Image 
        src={url} 
        alt={caption ?? 'Post image'} 
        className="w-full object-cover aspect-2/1" 
        width={width} 
        height={DEFAULT_IMAGE_HEIGHT} 
      />
      {caption && <figcaption className="text-center text-sm">{caption}</figcaption>}
    </figure>
  );
}

export function AudioBlock({ block }: { block: Block }) {
  const props = getProps(block);
  const url = readString(props.url);
  if (!url) return null;

  const caption = readString(props.caption);
  const showPreview = readBoolean(props.showPreview) ?? true;

  return (
    <figure>
      {showPreview && (
        <audio controls src={url} className="w-full" preload="metadata" />
      )}
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer" 
        className="text-blue-600 hover:underline break-all"
      >
        {caption ?? 'Open audio'}
      </a>
    </figure>
  );
}

export function VideoBlock({ block }: { block: Block }) {
  const props = getProps(block);
  const url = readString(props.url);
  if (!url) return null;

  const caption = readString(props.caption);
  const showPreview = readBoolean(props.showPreview) ?? true;

  return (
    <figure>
      {showPreview && (
        <video controls src={url} className="w-full" preload="metadata" />
      )}
      {caption && <figcaption className="text-center text-sm">{caption}</figcaption>}
    </figure>
  );
}

export function FileBlock({ block }: { block: Block }) {
  const props = getProps(block);
  const url = readString(props.url);
  if (!url) return null;

  const name = readString(props.name) ?? 'Download file';
  const caption = readString(props.caption);

  return (
    <figure>
      <a 
        href={url} 
        target="_blank" 
        rel="noreferrer" 
        className="text-blue-600 hover:underline break-all"
      >
        {name}
      </a>
      {caption && <figcaption className="text-center text-sm">{caption}</figcaption>}
    </figure>
  );
}
