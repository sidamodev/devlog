'use client';

import type { Block } from '@blocknote/core';
import { createPostAction } from '@/features/posts/server/actions';
import {
  CREATE_POST_MESSAGES,
  TAG_MAX_COUNT,
  TAG_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  type CreatePostFieldErrors,
} from '@/features/posts/shared/create-post.rules';
import { useRouter } from 'next/navigation';
import { useMemo, useReducer } from 'react';
import { toast } from 'sonner';

type FormValues = {
  title: string;
  tagInput: string;
  body: Block[];
};

type FormState = {
  isSubmitting: boolean;
  editorKey: number;
  values: FormValues;
  fieldErrors: CreatePostFieldErrors;
};

type Action =
  | { type: 'TITLE_CHANGED'; title: string }
  | { type: 'TAG_INPUT_CHANGED'; tagInput: string }
  | { type: 'BODY_CHANGED'; body: Block[] }
  | { type: 'SET_ERRORS'; errors: CreatePostFieldErrors }
  | { type: 'SUBMIT_STARTED' }
  | { type: 'SUBMIT_ENDED' }
  | { type: 'SUBMIT_SUCCEEDED' };

const initialState: FormState = {
  isSubmitting: false,
  editorKey: 0,
  values: {
    title: '',
    tagInput: '',
    body: [],
  },
  fieldErrors: {},
};

const postSuccessMessage = '게시글이 등록되었습니다. 목록으로 이동합니다.';

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

const validateClientValues = (values: FormValues): CreatePostFieldErrors => {
  const nextErrors: CreatePostFieldErrors = {};
  const title = values.title.trim();
  const plainText = collectTextFromBlocks(values.body);
  const tags = parseTags(values.tagInput);

  if (!title) {
    nextErrors.title = [CREATE_POST_MESSAGES.titleRequired];
  } else if (title.length > TITLE_MAX_LENGTH) {
    nextErrors.title = [CREATE_POST_MESSAGES.titleTooLong];
  }

  if (!plainText) {
    nextErrors.body = [CREATE_POST_MESSAGES.bodyRequired];
  }

  if (tags.length > TAG_MAX_COUNT) {
    nextErrors.tags = [CREATE_POST_MESSAGES.tagsTooMany];
  } else if (tags.some((tag) => tag.length > TAG_MAX_LENGTH)) {
    nextErrors.tags = [CREATE_POST_MESSAGES.tagsTooLong];
  }

  return nextErrors;
};

const toErrorToastMessage = (fieldErrors: CreatePostFieldErrors): string => {
  const deduped = new Set<string>();

  for (const messages of Object.values(fieldErrors)) {
    if (!messages) continue;
    for (const message of messages) {
      deduped.add(message);
    }
  }

  return Array.from(deduped).join('\n');
};

const reducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'TITLE_CHANGED':
      return {
        ...state,
        values: { ...state.values, title: action.title },
      };
    case 'TAG_INPUT_CHANGED':
      return {
        ...state,
        values: { ...state.values, tagInput: action.tagInput },
      };
    case 'BODY_CHANGED':
      return {
        ...state,
        values: { ...state.values, body: action.body },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        fieldErrors: action.errors,
      };
    case 'SUBMIT_STARTED':
      return {
        ...state,
        isSubmitting: true,
      };
    case 'SUBMIT_ENDED':
      return {
        ...state,
        isSubmitting: false,
      };
    case 'SUBMIT_SUCCEEDED':
      return {
        ...state,
        isSubmitting: false,
        editorKey: state.editorKey + 1,
        values: {
          title: '',
          tagInput: '',
          body: [],
        },
        fieldErrors: {},
      };
    default:
      return state;
  }
};

export const usePostWriteForm = () => {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);

  const titleLength = useMemo(() => state.values.title.trim().length, [state.values.title]);

  const onTitleChange = (title: string) => {
    dispatch({ type: 'TITLE_CHANGED', title });
  };

  const onTagInputChange = (tagInput: string) => {
    dispatch({ type: 'TAG_INPUT_CHANGED', tagInput });
  };

  const onBodyChange = (body: Block[]) => {
    dispatch({ type: 'BODY_CHANGED', body });
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.isSubmitting) return;

    const nextErrors = validateClientValues(state.values);
    dispatch({ type: 'SET_ERRORS', errors: nextErrors });

    if (Object.keys(nextErrors).length > 0) {
      toast.error(toErrorToastMessage(nextErrors));
      return;
    }

    try {
      dispatch({ type: 'SUBMIT_STARTED' });
      const result = await createPostAction({
        title: state.values.title.trim(),
        body: state.values.body,
        tags: parseTags(state.values.tagInput),
      });

      if (!result.ok) {
        const errorFieldMap = result.error.fieldErrors ?? {};
        dispatch({ type: 'SET_ERRORS', errors: errorFieldMap });

        if (Object.keys(errorFieldMap).length > 0) {
          toast.error(toErrorToastMessage(errorFieldMap));
        } else {
          toast.error(result.error.message);
        }
        return;
      }

      dispatch({ type: 'SUBMIT_SUCCEEDED' });
      toast.success(postSuccessMessage);
      router.push(`/@${result.post.author.username}/${result.post.slug}`);
    } catch {
      toast.error(CREATE_POST_MESSAGES.internalError);
    } finally {
      dispatch({ type: 'SUBMIT_ENDED' });
    }
  };

  return {
    isSubmitting: state.isSubmitting,
    editorKey: state.editorKey,
    title: state.values.title,
    tagInput: state.values.tagInput,
    fieldErrors: state.fieldErrors,
    titleLength,
    onTitleChange,
    onTagInputChange,
    onBodyChange,
    handleSubmit,
  };
};
