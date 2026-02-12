import 'server-only';

import { prisma } from '@/lib/prisma';

const postInclude = {
  author: {
    select: {
      id: true,
      username: true,
      nickname: true,
      avatar: true,
    },
  },
} as const;

export const findPostList = async (cursor: number | undefined, pageSize: number) => {
  return prisma.post.findMany({
    take: pageSize + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ id: 'desc' }],
    include: postInclude,
  });
};

export const findPostById = async (id: number) => {
  return prisma.post.findUnique({
    where: { id },
    include: postInclude,
  });
};
