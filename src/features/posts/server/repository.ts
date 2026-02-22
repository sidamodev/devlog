import 'server-only';

import { prisma } from '@/lib/prisma';
import type { Prisma } from '../../../../generated/prisma/client';

const authorInclude = {
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
    select: {
      id: true,
      title: true,
      slug: true,
      ...authorInclude,
      authorId: true,
      createdAt: true,
      updatedAt: true,
      thumbnail: true,
      description: true,
      likeCount: true,
      commentCount: true,
      bookmarkCount: true,
    },
  });
};

export const findPostById = async (id: number) => {
  return prisma.post.findUnique({
    where: { id },
    include: authorInclude,
  });
};

export const findOrCreateDefaultAuthor = async () => {
  const existingAuthor = await prisma.user.findFirst({
    orderBy: { id: 'asc' },
    select: { id: true, username: true, nickname: true, avatar: true },
  });

  if (existingAuthor) {
    return existingAuthor;
  }

  return prisma.user.create({
    data: {
      username: 'writer',
      nickname: 'Writer',
      avatar: null,
    },
    select: { id: true, username: true, nickname: true, avatar: true },
  });
};

type CreatePostRecordInput = {
  authorId: number;
  slug: string;
  title: string;
  description: string;
  body: Prisma.InputJsonValue;
  readingTime: number;
};

export const createPostRecord = async (input: CreatePostRecordInput) => {
  return prisma.post.create({
    data: {
      authorId: input.authorId,
      slug: input.slug,
      title: input.title,
      description: input.description,
      body: input.body,
      readingTime: input.readingTime,
      thumbnail: null,
    },
    include: authorInclude,
  });
};
