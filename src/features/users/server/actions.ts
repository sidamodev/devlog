'use server';

import { claimUsername } from '@/features/users/server/repository';
import { USERNAME_MESSAGES, validateUsername } from '@/features/users/shared/username.utils';
import { getCurrentUser } from './service';

export type CompleteUsernameSetupResult =
  | {
      ok: true;
      username: string;
    }
  | {
      ok: false;
      message: string;
      normalizedUsername?: string;
    };

export const completeUsernameSetupAction = async (input: {
  username: string;
}): Promise<CompleteUsernameSetupResult> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        ok: false,
        message: USERNAME_MESSAGES.authRequired,
      };
    }

    if (currentUser.username) {
      return {
        ok: true,
        username: currentUser.username,
      };
    }

    const validated = validateUsername(input.username);
    if (!validated.ok) {
      return {
        ok: false,
        message: validated.message,
        normalizedUsername: validated.normalized,
      };
    }

    const claimedUser = await claimUsername(currentUser.id, validated.normalized);
    if (!claimedUser) {
      return {
        ok: false,
        message: USERNAME_MESSAGES.taken,
        normalizedUsername: validated.normalized,
      };
    }

    if (claimedUser.username !== validated.normalized) {
      return {
        ok: false,
        message: USERNAME_MESSAGES.alreadySet,
        normalizedUsername: claimedUser.username ?? validated.normalized,
      };
    }

    return {
      ok: true,
      username: claimedUser.username ?? validated.normalized,
    };
  } catch {
    return {
      ok: false,
      message: USERNAME_MESSAGES.submitFailed,
    };
  }
};
