import { transformerRemoveLineBreak } from '@shikijs/transformers';
import { codeToHtml } from 'shiki';
import { CopyButton } from './copy-button';

interface HighlightedCodeProps {
  code: string;
  language?: string;
  filename?: string;
}

export async function CodeBlock({ code, language = 'tsx', filename }: HighlightedCodeProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: 'github-dark-dimmed',
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

  return (
    <div className="my-8 rounded-xl overflow-hidden bg-[#22272e] shadow-xl border border-border/10">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d333b] border-b border-[#444c56]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50" />
        </div>

        {filename && <div className="text-xs font-mono text-gray-400 font-medium">{filename}</div>}

        <CopyButton code={code} />
      </div>

      <div
        className="py-4 mr-4 overflow-x-auto leading-6 font-mono text-sm sm:text-base"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style>{`
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
          padding-left: 3rem;          /* 번호 영역 확보 */
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
          color: rgba(115, 138, 148, 0.55);
          user-select: none;              /* 드래그 선택 시 번호 제외 */
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar { height: 8px; width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #444c56; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #545d68; }
      `}</style>
    </div>
  );
}
