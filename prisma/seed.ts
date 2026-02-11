import { prisma } from '../src/lib/prisma';
import type { Prisma } from '../generated/prisma/client';
import { POST_DETAIL_001 } from '../src/mocks/fixtures/post-1';
import { POST_DETAIL_002 } from '../src/mocks/fixtures/post-2';
import { POST_DETAIL_003 } from '../src/mocks/fixtures/post-3';
import { POST_LIST_FIXTURE } from '../src/mocks/fixtures/post-list';

type PostDetailFixture = {
  id: number;
  content: Prisma.InputJsonValue;
};

const DETAIL_FIXTURES: Readonly<PostDetailFixture[]> = [POST_DETAIL_001, POST_DETAIL_002, POST_DETAIL_003];
const detailById = new Map<number, PostDetailFixture>(DETAIL_FIXTURES.map((detail) => [detail.id, detail]));

const toInputJson = (value: unknown): Prisma.InputJsonValue => value as Prisma.InputJsonValue;

async function main() {
  console.log('Seeding database...');

  await prisma.$transaction([
    prisma.postRelation.deleteMany(),
    prisma.postBookmark.deleteMany(),
    prisma.postLike.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const userIdByUsername = new Map<string, number>();

  for (const item of POST_LIST_FIXTURE) {
    if (userIdByUsername.has(item.author.username)) {
      continue;
    }

    const user = await prisma.user.create({
      data: {
        username: item.author.username,
        nickname: item.author.nickname,
        avatar: item.author.avatar,
      },
    });

    userIdByUsername.set(item.author.username, user.id);
  }

  for (let i = 0; i < 3; i++) {
    const item = POST_LIST_FIXTURE[i];
    const userId = userIdByUsername.get(item.author.username);
    if (!userId) {
      throw new Error(`User not found for username: ${item.author.username}`);
    }

    const detail = detailById.get(item.id);
    const content = toInputJson(detail?.content ?? item.content);

    await prisma.post.create({
      data: {
        authorId: userId,
        slug: item.slug,
        title: item.title,
        thumbnail: item.thumbnail,
        description: item.description,
        content,
        readingTime: item.readingTime,
        likeCount: item.likeCount,
        commentCount: item.commentCount,
        bookmarkCount: item.bookmarkCount,
        createdAt: new Date(item.createdAt),
      },
    });
  }

  console.log(`Database seeded successfully! posts=${POST_LIST_FIXTURE.length}, detailed=${DETAIL_FIXTURES.length}`);
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
