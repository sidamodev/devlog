import { prisma } from '../src/lib/prisma';
import type { Prisma } from '../generated/prisma/client';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { POST_LIST_FIXTURE } from '../src/mocks/fixtures/post-list';

type PostDetailFixture = {
  id: number;
  body: Prisma.InputJsonValue;
};

const toInputJson = (value: unknown): Prisma.InputJsonValue => value as Prisma.InputJsonValue;
const DETAIL_FIXTURE_DIR = path.resolve(process.cwd(), 'src/mocks/fixtures/detail');

const isPostDetailFixture = (value: unknown): value is PostDetailFixture =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  typeof (value as { id: unknown }).id === 'number' &&
  'body' in value;

const loadDetailFixtures = async (): Promise<Readonly<PostDetailFixture[]>> => {
  const files = (await readdir(DETAIL_FIXTURE_DIR))
    .filter((file) => /^post-\d+\.ts$/.test(file))
    .sort((a, b) => {
      const aId = Number(a.match(/\d+/)?.[0] ?? 0);
      const bId = Number(b.match(/\d+/)?.[0] ?? 0);
      return aId - bId;
    });

  const details: PostDetailFixture[] = [];

  for (const file of files) {
    const modulePath = path.join(DETAIL_FIXTURE_DIR, file);
    const detailModule = (await import(pathToFileURL(modulePath).href)) as Record<string, unknown>;
    const fixture = Object.values(detailModule).find(isPostDetailFixture);

    if (!fixture) {
      throw new Error(`Detail fixture not found in module: ${file}`);
    }

    details.push({
      id: fixture.id,
      body: toInputJson(fixture.body),
    });
  }

  return details;
};

async function main() {
  console.log('Seeding database...');
  const detailFixtures = await loadDetailFixtures();
  const detailById = new Map<number, PostDetailFixture>();

  for (const detail of detailFixtures) {
    if (detailById.has(detail.id)) {
      throw new Error(`Duplicate detail fixture id: ${detail.id}`);
    }
    detailById.set(detail.id, detail);
  }

  const postsToSeed = POST_LIST_FIXTURE.filter((post) => detailById.has(post.id));

  await prisma.$transaction([
    prisma.postRelation.deleteMany(),
    prisma.postBookmark.deleteMany(),
    prisma.postLike.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const userIdByUsername = new Map<string, number>();

  for (const item of postsToSeed) {
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

  for (const item of postsToSeed) {
    const userId = userIdByUsername.get(item.author.username);
    if (!userId) {
      throw new Error(`User not found for username: ${item.author.username}`);
    }

    const detail = detailById.get(item.id);
    if (!detail) {
      throw new Error(`Detail fixture not found for post id: ${item.id}`);
    }

    await prisma.post.create({
      data: {
        authorId: userId,
        slug: item.slug,
        title: item.title,
        thumbnail: item.thumbnail,
        description: item.description,
        body: detail.body,
        readingTime: item.readingTime,
        likeCount: item.likeCount,
        commentCount: item.commentCount,
        bookmarkCount: item.bookmarkCount,
        createdAt: new Date(item.createdAt),
      },
    });
  }

  console.log(`Database seeded successfully! posts=${postsToSeed.length}, detailed=${detailFixtures.length}`);
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
