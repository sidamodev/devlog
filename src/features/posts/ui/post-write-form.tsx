'use client';

import Editor from '@/components/editor';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DESCRIPTION_MAX_LENGTH, TAG_MAX_COUNT, TITLE_MAX_LENGTH } from '@/features/posts/shared/create-post.rules';
import { usePostWriteForm } from '@/features/posts/client/use-post-write-form';
import { cn } from '@/lib/utils';
import { Tag, X } from 'lucide-react';
import { type ChangeEvent } from 'react';

type PostWriteFormProps = {
  initialDescription?: string;
  isGeneratedDescription?: boolean;
};

const PostWriteForm = ({ initialDescription, isGeneratedDescription }: PostWriteFormProps) => {
  const {
    isSubmitting,
    editorKey,
    title,
    description,
    tags,
    isTagLimitReached,
    tagInput,
    fieldErrors,
    titleLength,
    onTitleChange,
    onDescriptionChange,
    onTagInputChange,
    onTagInputKeyDown,
    onTagInputBlur,
    onTagRemove,
    onBodyChange,
    handleSubmit,
  } = usePostWriteForm({ initialDescription, isGeneratedDescription });

  // Textarea의 높이를 내용에 맞게 자동으로 조절하는 핸들러
  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>, onChange: (value: string) => void) => {
    const textarea = e.currentTarget;
    textarea.style.height = '0px';
    textarea.style.height = `${textarea.scrollHeight}px`;
    onChange(textarea.value);
  };

  const renderTagChip = (tag: string) => (
    <span
      role="button"
      tabIndex={0}
      onClick={() => onTagRemove(tag)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTagRemove(tag);
        }
      }}
      className="bg-muted text-foreground hover:bg-muted/80 focus-visible:ring-ring/50 inline-flex items-center cursor-pointer select-none rounded-full border border-border px-2 py-1 text-xs font-medium max-w-50 focus-visible:outline-none focus-visible:ring-[3px]"
      aria-label={`${tag} 태그 삭제`}
    >
      <span className="truncate">{tag}</span>
      <X className="ml-1 size-3 shrink-0" aria-hidden="true" />
    </span>
  );

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit} noValidate>
      <div className="mt-2 flex items-center justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} className="w-16">
          {isSubmitting ? '등록 중...' : '글쓰기'}
        </Button>
      </div>
      <section aria-label="제목 입력란" className="flex flex-col gap-2 relative">
        <label htmlFor="title" className="sr-only">
          제목
        </label>
        <textarea
          id="title"
          name="title"
          placeholder="제목"
          value={title}
          onChange={(e) => handleTextareaChange(e, onTitleChange)}
          maxLength={TITLE_MAX_LENGTH}
          rows={1}
          aria-invalid={Boolean(fieldErrors.title?.length)}
          className="min-h-14 w-full resize-none overflow-hidden border-none bg-transparent px-0 py-2 text-4xl sm:text-5xl leading-tight font-extrabold shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0"
        />
        <p
          className={cn(
            'text-xs absolute right-2 -bottom-2',
            titleLength >= TITLE_MAX_LENGTH ? 'text-red-500' : 'text-muted-foreground',
          )}
        >
          {titleLength}/{TITLE_MAX_LENGTH}
        </p>
      </section>

      <section aria-label="설명 입력란" className="flex flex-col gap-2 relative">
        <label htmlFor="description" className="sr-only">
          설명
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="설명 (선택)"
          value={description}
          onChange={(e) => handleTextareaChange(e, onDescriptionChange)}
          maxLength={DESCRIPTION_MAX_LENGTH}
          rows={1}
          aria-invalid={Boolean(fieldErrors.description?.length)}
          className="w-full resize-none border-none bg-transparent px-0 py-1 text-sm text-muted-foreground outline-none placeholder:text-muted-foreground"
        />
        <p
          className={cn(
            'text-xs absolute right-2 -bottom-2',
            description.length >= DESCRIPTION_MAX_LENGTH ? 'text-red-500' : 'text-muted-foreground',
          )}
        >
          {description.length}/{DESCRIPTION_MAX_LENGTH}
        </p>
      </section>

      <section aria-label="태그 입력란" className="flex flex-col gap-2">
        <div
          className="min-h-9 bg-transparent px-2 py-1 flex flex-wrap items-center gap-1"
          aria-invalid={Boolean(fieldErrors.tags?.length)}
        >
          <label htmlFor="tags" className="inline-flex h-7 items-center text-sm font-medium">
            <Tag className="size-3" aria-hidden="true" />
          </label>
          <TooltipProvider>
            {tags.map((tag) =>
              tag.length > 20 ? (
                <Tooltip key={tag}>
                  <TooltipTrigger asChild>{renderTagChip(tag)}</TooltipTrigger>
                  <TooltipContent side="top">{tag}</TooltipContent>
                </Tooltip>
              ) : (
                <span key={tag}>{renderTagChip(tag)}</span>
              ),
            )}
          </TooltipProvider>
          <input
            id="tags"
            name="tags"
            placeholder={
              isTagLimitReached
                ? `태그는 최대 ${TAG_MAX_COUNT}개까지 입력할 수 있습니다.`
                : tags.length === 0
                  ? '태그를 입력하세요 (, 또는 스페이스로 구분)'
                  : ''
            }
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onTagInputKeyDown}
            onBlur={onTagInputBlur}
            className="flex-1 min-w-64 placeholder:text-muted-foreground border-none bg-transparent px-1 py-1 text-sm outline-none"
            aria-invalid={Boolean(fieldErrors.tags?.length)}
            disabled={isTagLimitReached && !tagInput}
          />
        </div>
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
