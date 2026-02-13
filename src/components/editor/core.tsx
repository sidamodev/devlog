'use client';

import { codeBlockOptions } from '@blocknote/code-block';
import { Block, BlockNoteSchema, createCodeBlockSpec } from '@blocknote/core';
import '@blocknote/core/fonts/inter.css';
import { ko } from '@blocknote/core/locales';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import { useTheme } from 'next-themes';

type EditorCoreProps = {
  onChange?: (blocks: Block[]) => void;
};

const EditorCore = ({ onChange }: EditorCoreProps) => {
  const { resolvedTheme } = useTheme();
  const editor = useCreateBlockNote({
    dictionary: ko,
    schema: BlockNoteSchema.create().extend({
      blockSpecs: { codeBlock: createCodeBlockSpec(codeBlockOptions) },
    }),
  });

  return (
    <BlockNoteView
      editor={editor}
      onChange={() => {
        onChange?.(editor.document);
      }}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  );
};
export default EditorCore;
