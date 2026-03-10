import 'server-only';

import { auth } from '@/auth';
import { headers } from 'next/headers';
import { findUserById } from './repository';

export const getCurrentUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }

  return findUserById(userId);
};
