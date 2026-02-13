'use client';

import type { Block } from '@blocknote/core';
import Editor from '@/components/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { createPostAction } from '@/features/posts/server/actions';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type FieldErrors = {
  title?: string;
  body?: string;
  tags?: string;
};

type Feedback = {
  type: 'success' | 'error';
  message: string;
};

const TITLE_MAX_LENGTH = 120;
const TAG_MAX_COUNT = 10;
const TAG_MAX_LENGTH = 20;

const collectTextFromInline = (content: unknown): string => {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';

  return content
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'text' in item) {
        const text = (item as { text?: unknown }).text;
        return typeof text === 'string' ? text : '';
      }
      return '';
    })
    .join(' ');
};

const collectTextFromBlocks = (blocks: Block[]): string => {
  return blocks
    .map((block) => {
      const currentText = collectTextFromInline((block as { content?: unknown }).content);
      const children = (block as { children?: unknown }).children;

      if (Array.isArray(children) && children.length > 0) {
        return [currentText, collectTextFromBlocks(children as Block[])].join(' ');
      }

      return currentText;
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const parseTags = (value: string): string[] => {
  if (!value.trim()) return [];

  return Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    ),
  );
};

const PostWriteForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const [title, setTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [body, setBody] = useState<Block[]>([]);

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const tagList = useMemo(() => parseTags(tagInput), [tagInput]);

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!title.trim()) {
      nextErrors.title = '제목은 필수 입력값입니다.';
    } else if (title.trim().length > TITLE_MAX_LENGTH) {
      nextErrors.title = `제목은 ${TITLE_MAX_LENGTH}자 이하로 입력해주세요.`;
    }

    const plainText = collectTextFromBlocks(body);
    if (!plainText) {
      nextErrors.body = '본문은 필수 입력값입니다.';
    }

    if (tagList.length > TAG_MAX_COUNT) {
      nextErrors.tags = `태그는 최대 ${TAG_MAX_COUNT}개까지 입력할 수 있습니다.`;
    } else if (tagList.some((tag) => tag.length > TAG_MAX_LENGTH)) {
      nextErrors.tags = `태그는 ${TAG_MAX_LENGTH}자 이하로 입력해주세요.`;
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validate();
    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFeedback({ type: 'error', message: '입력값을 확인해주세요.' });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await createPostAction({
        title: title.trim(),
        body,
        tags: tagList,
      });

      if (!result.ok) {
        setFieldErrors(result.errors ?? {});
        setFeedback({ type: 'error', message: result.message });
        return;
      }

      setTitle('');
      setTagInput('');
      setBody([]);
      setEditorKey((prev) => prev + 1);
      setFieldErrors({});
      setFeedback({ type: 'success', message: '게시글이 등록되었습니다. 목록으로 이동합니다.' });
      router.push('/');
    } catch {
      setFeedback({ type: 'error', message: '게시글 등록 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex w-full flex-col gap-4 p-6 sm:p-8" onSubmit={handleSubmit} noValidate>
      <div className="mt-2 flex items-center justify-between gap-3">
        <p
          role="status"
          aria-live="polite"
          className={
            feedback?.type === 'error' ? 'text-sm text-destructive' : 'text-sm text-emerald-600 dark:text-emerald-400'
          }
        >
          {feedback?.message ?? ''}
        </p>
        <Button type="submit" disabled={isSubmitting} className="min-w-24">
          {isSubmitting ? '등록 중...' : '게시글 등록'}
        </Button>
      </div>
      <section aria-label="제목 입력란" className="flex flex-col gap-2">
        <label htmlFor="title" className="sr-only">
          제목
        </label>
        <Input
          id="title"
          name="title"
          placeholder="제목"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          aria-invalid={Boolean(fieldErrors.title)}
          className="h-14 border-none bg-transparent px-0 text-4xl leading-tight font-extrabold shadow-none focus-visible:ring-0 sm:text-5xl"
        />
        <p className="text-xs text-muted-foreground">
          {title.trim().length}/{TITLE_MAX_LENGTH}
        </p>
        {fieldErrors.title ? <p className="text-sm text-destructive">{fieldErrors.title}</p> : null}
      </section>

      <section aria-label="태그 입력란" className="flex flex-col gap-2">
        <label htmlFor="tags" className="text-sm font-medium">
          태그 (선택)
        </label>
        <Input
          id="tags"
          name="tags"
          placeholder="쉼표(,)로 구분하여 입력하세요. 예) react, nextjs"
          value={tagInput}
          onChange={(event) => setTagInput(event.target.value)}
          aria-invalid={Boolean(fieldErrors.tags)}
        />
        {fieldErrors.tags ? <p className="text-sm text-destructive">{fieldErrors.tags}</p> : null}
      </section>

      <Separator />

      <section aria-label="본문 입력" className="flex flex-col gap-2">
        <div className="min-h-72">
          <Editor key={editorKey} onChange={setBody} />
        </div>
        {fieldErrors.body ? <p className="text-sm text-destructive">{fieldErrors.body}</p> : null}
      </section>
    </form>
  );
};

export default PostWriteForm;
