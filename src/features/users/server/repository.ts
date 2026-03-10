import 'server-only';

import { Prisma } from '../../../../generated/prisma/client';
import { prisma } from '@/lib/prisma';

const publicUserSelect = {
  id: true,
  username: true,
  name: true,
  image: true,
} as const;

const usernameSeedSelect = {
  ...publicUserSelect,
  email: true,
} as const;

export type CurrentUser = Prisma.UserGetPayload<{ select: typeof usernameSeedSelect }>;
export type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

const isUniqueConstraintError = (error: unknown) =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';

const toPublicUser = (user: CurrentUser): PublicUser => ({
  id: user.id,
  username: user.username ?? '',
  name: user.name,
  image: user.image,
});

export const findUserById = async (userId: string): Promise<CurrentUser | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: usernameSeedSelect,
  });
};

export const claimUsername = async (userId: string, username: string): Promise<PublicUser | null> => {
  try {
    return await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { id: userId },
        select: usernameSeedSelect,
      });

      if (!existingUser) {
        return null;
      }

      if (existingUser.username) {
        return toPublicUser(existingUser);
      }

      await tx.user.updateMany({
        where: {
          id: userId,
          username: null,
        },
        data: {
          username,
        },
      });

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: publicUserSelect,
      });

      if (!user?.username) return null;
      return user;
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return null;
    }

    throw error;
  }
};
