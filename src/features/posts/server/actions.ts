'use server';

import {
  createPost,
  type CreatePostFailure,
  type CreatePostInput,
  type CreatePostSuccess,
} from '@/features/posts/server/service';

export type CreatePostActionResult = CreatePostSuccess | CreatePostFailure;

const toActionInput = (input: {
  title: string;
  body: unknown;
  tags?: string[];
}): CreatePostInput => ({
  title: input.title,
  body: input.body,
  tags: input.tags,
});

const toActionFailure = (result: CreatePostFailure): Extract<CreatePostActionResult, { ok: false }> => result;

export const createPostAction = async (input: {
  title: string;
  body: unknown;
  tags?: string[];
}): Promise<CreatePostActionResult> => {
  const result = await createPost(toActionInput(input));

  if (!result.ok) {
    return toActionFailure(result);
  }

  return result;
};
