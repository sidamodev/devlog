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
import { collectTextFromBlocks } from '@/features/posts/shared/post-content.utils';
import { useRouter } from 'next/navigation';
import { useMemo, useReducer, type KeyboardEvent } from 'react';
import { toast } from 'sonner';

type FormValues = {
  title: string;
  tags: string[];
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
  | { type: 'TAGS_INPUT_PARSED'; tagInput: string; tagsToAdd: string[] }
  | { type: 'TAG_REMOVED'; tag: string }
  | { type: 'TAG_LAST_REMOVED' }
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
    tags: [],
    tagInput: '',
    body: [],
  },
  fieldErrors: {},
};

const postSuccessMessage = '게시글이 등록되었습니다.';

const appendUniqueTags = (currentTags: string[], tagsToAdd: string[]): string[] => {
  if (tagsToAdd.length === 0) return currentTags;

  const seen = new Set(currentTags);
  const appended = [...currentTags];

  for (const tag of tagsToAdd) {
    if (appended.length >= TAG_MAX_COUNT) break;
    const trimmed = tag.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    appended.push(trimmed);
  }

  return appended;
};

const getTagsWithPendingInput = (values: FormValues): string[] => {
  const pending = values.tagInput.trim();
  if (!pending) return values.tags;
  return appendUniqueTags(values.tags, [pending]);
};

const validateClientValues = (values: FormValues): CreatePostFieldErrors => {
  const nextErrors: CreatePostFieldErrors = {};
  const title = values.title.trim();
  const plainText = collectTextFromBlocks(values.body);
  const tags = getTagsWithPendingInput(values);

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
  const preferredOrder: (keyof CreatePostFieldErrors)[] = ['title', 'body', 'tags'];

  for (const key of preferredOrder) {
    const firstMessage = fieldErrors[key]?.[0];
    if (firstMessage) return firstMessage;
  }

  for (const messages of Object.values(fieldErrors)) {
    const firstMessage = messages?.[0];
    if (firstMessage) return firstMessage;
  }

  return CREATE_POST_MESSAGES.invalidInput;
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
    case 'TAGS_INPUT_PARSED':
      return {
        ...state,
        values: {
          ...state.values,
          tagInput: action.tagInput,
          tags: appendUniqueTags(state.values.tags, action.tagsToAdd),
        },
      };
    case 'TAG_REMOVED':
      return {
        ...state,
        values: {
          ...state.values,
          tags: state.values.tags.filter((tag) => tag !== action.tag),
        },
      };
    case 'TAG_LAST_REMOVED':
      return {
        ...state,
        values: {
          ...state.values,
          tags: state.values.tags.slice(0, -1),
        },
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
          tags: [],
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
  const isTagLimitReached = state.values.tags.length >= TAG_MAX_COUNT;

  const onTitleChange = (title: string) => {
    dispatch({ type: 'TITLE_CHANGED', title });
  };

  const onTagInputChange = (tagInput: string) => {
    if (isTagLimitReached && !state.values.tagInput) return;

    const includesDelimiter = /[,\s]/.test(tagInput);
    if (!includesDelimiter) {
      dispatch({ type: 'TAG_INPUT_CHANGED', tagInput });
      return;
    }

    const endsWithDelimiter = /[,\s]$/.test(tagInput);
    const pieces = tagInput
      .split(/[,\s]+/)
      .map((piece) => piece.trim())
      .filter((piece) => piece.length > 0);
    const tagsToAdd = endsWithDelimiter ? pieces : pieces.slice(0, -1);
    const nextInput = endsWithDelimiter ? '' : (pieces.at(-1) ?? '');

    dispatch({
      type: 'TAGS_INPUT_PARSED',
      tagInput: nextInput,
      tagsToAdd,
    });
  };

  const onTagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ',' || event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      if (isTagLimitReached) return;
      const trimmed = state.values.tagInput.trim();
      if (!trimmed) return;

      dispatch({
        type: 'TAGS_INPUT_PARSED',
        tagInput: '',
        tagsToAdd: [trimmed],
      });
      return;
    }

    if (event.key === 'Backspace' && !state.values.tagInput && state.values.tags.length > 0) {
      dispatch({ type: 'TAG_LAST_REMOVED' });
    }
  };

  const onTagInputBlur = () => {
    if (isTagLimitReached) return;
    const trimmed = state.values.tagInput.trim();
    if (!trimmed) return;

    dispatch({
      type: 'TAGS_INPUT_PARSED',
      tagInput: '',
      tagsToAdd: [trimmed],
    });
  };

  const onTagRemove = (tag: string) => {
    dispatch({ type: 'TAG_REMOVED', tag });
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
        tags: getTagsWithPendingInput(state.values),
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
    tags: state.values.tags,
    isTagLimitReached,
    tagInput: state.values.tagInput,
    fieldErrors: state.fieldErrors,
    titleLength,
    onTitleChange,
    onTagInputChange,
    onTagInputKeyDown,
    onTagInputBlur,
    onTagRemove,
    onBodyChange,
    handleSubmit,
  };
};
