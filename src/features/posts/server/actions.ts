'use server';

import type {
  CreatePostFailure,
  CreatePostInput,
  CreatePostSuccess,
} from '@/features/posts/shared/post.contracts';
import { getCurrentUser } from '@/features/users/server/service';
import { CREATE_POST_MESSAGES } from '@/features/posts/shared/create-post.rules';
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
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return {
      ok: false,
      error: {
        code: 'UNAUTHORIZED',
        message: CREATE_POST_MESSAGES.authRequired,
      },
    };
  }

  if (!currentUser.username) {
    return {
      ok: false,
      error: {
        code: 'USERNAME_REQUIRED',
        message: CREATE_POST_MESSAGES.usernameRequired,
      },
    };
  }

  const result = await createPost(toActionInput(input), currentUser.id);

  if (!result.ok) {
    return toActionFailure(result);
  }

  return result;
};
