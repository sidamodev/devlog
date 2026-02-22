import { transformerRemoveLineBreak } from '@shikijs/transformers';
import { codeToHtml } from 'shiki';
import { CopyButton } from './copy-button';

interface HighlightedCodeProps {
  code: string;
  language?: string;
}

export async function CodeBlock({ code, language = 'text' }: HighlightedCodeProps) {
  const buildHtml = (theme: string) =>
    codeToHtml(code.trimEnd(), {
      lang: language,
      theme,
      transformers: [
        transformerRemoveLineBreak(),
        {
          name: 'line-numbers',
          pre(node) {
            this.addClassToHast(node, 'has-line-numbers');
          },
          line(node, line) {
            this.addClassToHast(node, 'code-line');
            node.properties['data-line'] = line; // 1부터 시작
          },
        },
      ],
    });

  const [lightHtml, darkHtml] = await Promise.all([buildHtml('github-light'), buildHtml('github-dark-dimmed')]);

  return (
    <div className="not-prose code-block font-mono relative my-8 overflow-hidden rounded-sm border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-[#22272e]">
      <CopyButton className="absolute right-2 top-2 z-1" code={code} />

      <div
        className="code-scroll-area overflow-x-auto pt-2 pb-1 text-xs dark:hidden sm:text-sm"
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
      <div
        className="code-scroll-area hidden overflow-x-auto pt-2 pb-1 text-xs dark:block sm:text-sm"
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />

      <style>{`
        .code-block pre,
        .code-block code {
          font-family: inherit;
        }
        .code-block {
          --cb-scroll-thumb: #c3cbd4;
          --cb-scroll-thumb-hover: #aab4bf;
        }
        html.dark .code-block {
          --cb-scroll-thumb: #444c56;
          --cb-scroll-thumb-hover: #545d68;
        }

        .shiki {
          background-color: transparent !important;
          margin: 0;
          padding: 0;
        }

        pre.shiki code {
          display: block;                 /* 코드 전체를 블록으로 처리 */
          min-width: max-content;              /* 코드 길이에 따라 너비 조절 */
        }
        pre.shiki.has-line-numbers .code-line {
          display: block;                 /* 한 줄씩 줄바꿈 */
          padding-left: 0.5rem;          /* 번호 영역 확보 */
          padding-right: 0.5rem;
          position: relative;
          min-height: 1lh; /* 한 줄 높이 보장 */
        }

        /* Custom scrollbar */
        .code-scroll-area {
          scrollbar-width: thin;
          scrollbar-color: var(--cb-scroll-thumb) transparent;
        }
        .code-block ::-webkit-scrollbar-track { background: transparent; }
        .code-block ::-webkit-scrollbar-thumb {
          background: var(--cb-scroll-thumb);
          border: 1px solid transparent;
          background-clip: content-box;
          border-radius: 999px;
        }
        .code-block ::-webkit-scrollbar-thumb:hover { background: var(--cb-scroll-thumb-hover); }
      `}</style>
    </div>
  );
}
