import 'server-only';

import type { Block } from '@blocknote/core';
import {
  CREATE_POST_MESSAGES,
  DESCRIPTION_MAX_LENGTH,
  TAG_MAX_COUNT,
  TAG_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  type CreatePostFieldErrors,
} from '@/features/posts/shared/create-post.rules';
import { collectTextFromBlocks } from '@/features/posts/shared/post-content.utils';
import { z } from 'zod';

const titleSchema = z
  .string()
  .trim()
  .min(1, { message: CREATE_POST_MESSAGES.titleRequired })
  .max(TITLE_MAX_LENGTH, { message: CREATE_POST_MESSAGES.titleTooLong });

const bodySchema = z.array(z.object({}).passthrough());

const descriptionSchema = z
  .string()
  .trim()
  .max(DESCRIPTION_MAX_LENGTH, { message: CREATE_POST_MESSAGES.descriptionTooLong })
  .transform((value) => (value.length > 0 ? value : undefined));

const tagsSchema = z.preprocess(
  (value) => {
    if (!Array.isArray(value)) return [];

    const normalized = value
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    return Array.from(new Set(normalized));
  },
  z.array(z.string()).superRefine((tags, ctx) => {
    if (tags.length > TAG_MAX_COUNT) {
      ctx.addIssue({
        code: 'custom',
        message: CREATE_POST_MESSAGES.tagsTooMany,
      });
    }

    if (tags.some((tag) => tag.length > TAG_MAX_LENGTH)) {
      ctx.addIssue({
        code: 'custom',
        message: CREATE_POST_MESSAGES.tagsTooLong,
      });
    }
  }),
);

const createPostEnvelopeSchema = z.preprocess(
  (value) => (value && typeof value === 'object' ? value : {}),
  z.object({
    title: z.unknown().optional(),
    body: z.unknown().optional(),
    description: z.unknown().optional(),
    tags: z.unknown().optional(),
  }),
);

const addFieldError = (fieldErrors: CreatePostFieldErrors, field: keyof CreatePostFieldErrors, message: string) => {
  const messages = fieldErrors[field] ?? [];
  if (!messages.includes(message)) {
    fieldErrors[field] = [...messages, message];
  }
};

const addZodIssuesToFieldErrors = (
  fieldErrors: CreatePostFieldErrors,
  field: keyof CreatePostFieldErrors,
  issues: z.ZodIssue[],
) => {
  for (const issue of issues) {
    if (issue.message) {
      addFieldError(fieldErrors, field, issue.message);
    }
  }
};

export type ValidatedCreatePostInput = {
  title: string;
  body: Block[];
  description?: string;
  tags: string[];
};

export type ValidateCreatePostInputResult =
  | {
      success: true;
      data: ValidatedCreatePostInput;
    }
  | {
      success: false;
      fieldErrors: CreatePostFieldErrors;
    };

export const validateCreatePostInput = (input: unknown): ValidateCreatePostInputResult => {
  const envelope = createPostEnvelopeSchema.parse(input);
  const fieldErrors: CreatePostFieldErrors = {};

  let title = '';
  let body: Block[] = [];
  let description: string | undefined;
  let tags: string[] = [];

  const titleResult = titleSchema.safeParse(envelope.title);
  if (titleResult.success) {
    title = titleResult.data;
  } else {
    addZodIssuesToFieldErrors(fieldErrors, 'title', titleResult.error.issues);
  }

  const bodyResult = bodySchema.safeParse(envelope.body);
  if (bodyResult.success) {
    body = bodyResult.data as Block[];
    if (!collectTextFromBlocks(body)) {
      addFieldError(fieldErrors, 'body', CREATE_POST_MESSAGES.bodyRequired);
    }
  } else {
    addFieldError(fieldErrors, 'body', CREATE_POST_MESSAGES.bodyInvalidFormat);
  }

  if (envelope.description !== undefined) {
    const descriptionResult = descriptionSchema.safeParse(envelope.description);
    if (descriptionResult.success) {
      description = descriptionResult.data;
    } else {
      addZodIssuesToFieldErrors(fieldErrors, 'description', descriptionResult.error.issues);
    }
  }

  const tagsResult = tagsSchema.safeParse(envelope.tags);
  if (tagsResult.success) {
    tags = tagsResult.data;
  } else {
    addZodIssuesToFieldErrors(fieldErrors, 'tags', tagsResult.error.issues);
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false,
      fieldErrors,
    };
  }

  return {
    success: true,
    data: {
      title,
      body,
      description,
      tags,
    },
  };
};
