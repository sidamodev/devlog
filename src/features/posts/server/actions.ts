'use server';

import type {
  CreatePostFailure,
  CreatePostInput,
  CreatePostSuccess,
} from '@/features/posts/shared/post.contracts';
import { createPost } from '@/features/posts/server/service';

export type CreatePostActionResult = CreatePostSuccess | CreatePostFailure;

const toActionInput = (input: {
  title: string;
  body: unknown;
  description?: string;
  tags?: string[];
}): CreatePostInput => ({
  title: input.title,
  body: input.body,
  description: input.description,
  tags: input.tags,
});

const toActionFailure = (result: CreatePostFailure): Extract<CreatePostActionResult, { ok: false }> => result;

export const createPostAction = async (input: {
  title: string;
  body: unknown;
  description?: string;
  tags?: string[];
}): Promise<CreatePostActionResult> => {
  const result = await createPost(toActionInput(input));

  if (!result.ok) {
    return toActionFailure(result);
  }

  return result;
};
