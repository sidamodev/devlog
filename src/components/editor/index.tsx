'use client';
import type { Block } from '@blocknote/core';
import dynamic from 'next/dynamic';

type EditorProps = {
  onChange?: (blocks: Block[]) => void;
};

const Editor = dynamic<EditorProps>(() => import('./core'), { ssr: false });
export default Editor;
