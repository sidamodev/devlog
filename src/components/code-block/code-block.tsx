import { transformerRemoveLineBreak } from '@shikijs/transformers';
import { codeToHtml } from 'shiki';
import { CopyButton } from './copy-button';

interface HighlightedCodeProps {
  code: string;
  language?: string;
}

export async function CodeBlock({ code, language = 'text' }: HighlightedCodeProps) {
  const buildHtml = (theme: string) =>
    codeToHtml(code, {
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
    <div className="code-block my-8 overflow-hidden rounded-sm sm:rounded-lg border border-zinc-200 bg-zinc-50 shadow-sm dark:border-zinc-700 dark:bg-[#22272e]">
      <div className="hidden sm:flex items-center justify-between border-b border-zinc-200 bg-zinc-100 px-2 py-1 dark:border-[#444c56] dark:bg-[#2d333b]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50" />
        </div>

        <div className="font-mono text-xs font-bold tracking-tight text-zinc-500 dark:text-gray-400">
          {language.toUpperCase()}
        </div>

        <CopyButton code={code} />
      </div>

      <div
        className="code-scroll-area overflow-x-auto pt-3 pb-1 font-mono text-xs leading-none dark:hidden sm:text-sm"
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
      <div
        className="code-scroll-area hidden overflow-x-auto pt-3 pb-1 font-mono text-xs leading-none dark:block sm:text-sm"
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />

      <style>{`
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

        /* counter 기반 라인번호 */
        pre.shiki.has-line-numbers code {
          counter-reset: line;
        }
        pre.shiki.has-line-numbers .code-line {
          display: block;                 /* 한 줄씩 줄바꿈 */
          padding-left: 2.5rem;          /* 번호 영역 확보 */
          position: relative;
          min-height: 1lh; /* 한 줄 높이 보장 */
        }
        pre.shiki.has-line-numbers .code-line::before {
          counter-increment: line;
          content: counter(line);
          position: absolute;
          left: 0;
          width: 2rem;
          text-align: right;
          letter-spacing: -0.05em;
          color: rgba(115, 138, 148, 0.55);
          user-select: none;              /* 드래그 선택 시 번호 제외 */
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
