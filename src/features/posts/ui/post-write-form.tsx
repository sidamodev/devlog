'use client';

import Editor from '@/components/editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { TITLE_MAX_LENGTH } from '@/features/posts/shared/create-post.rules';
import { usePostWriteForm } from '@/features/posts/client/use-post-write-form';
import { useLayoutEffect, useRef } from 'react';

const PostWriteForm = () => {
  const {
    isSubmitting,
    editorKey,
    title,
    tagInput,
    fieldErrors,
    titleLength,
    onTitleChange,
    onTagInputChange,
    onBodyChange,
    handleSubmit,
  } = usePostWriteForm();

  const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = titleTextareaRef.current;
    if (!textarea) return;

    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [title]);

  return (
    <form className="flex w-full flex-col gap-4 p-6 sm:p-8" onSubmit={handleSubmit} noValidate>
      <div className="mt-2 flex items-center justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-24">
          {isSubmitting ? '등록 중...' : '게시글 등록'}
        </Button>
      </div>
      <section aria-label="제목 입력란" className="flex flex-col gap-2">
        <label htmlFor="title" className="sr-only">
          제목
        </label>
        <textarea
          id="title"
          name="title"
          ref={titleTextareaRef}
          placeholder="제목"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          maxLength={TITLE_MAX_LENGTH}
          rows={1}
          aria-invalid={Boolean(fieldErrors.title?.length)}
          className="min-h-14 w-full resize-none overflow-hidden border-none bg-transparent px-0 py-2 text-4xl sm:text-5xl leading-tight font-extrabold shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
        />
        <p className="text-xs text-muted-foreground">
          {titleLength}/{TITLE_MAX_LENGTH}
        </p>
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
          onChange={(event) => onTagInputChange(event.target.value)}
          aria-invalid={Boolean(fieldErrors.tags?.length)}
        />
      </section>

      <Separator />

      <section aria-label="본문 입력" className="flex flex-col gap-2">
        <div className="min-h-72">
          <Editor key={editorKey} onChange={onBodyChange} />
        </div>
      </section>
    </form>
  );
};

export default PostWriteForm;
