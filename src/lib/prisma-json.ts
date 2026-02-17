import type { Prisma } from '../../generated/prisma/client';

const toPrismaInputJsonNode = (value: unknown): Prisma.InputJsonValue | null => {
  if (value === null) {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (Array.isArray(value)) {
    return value.map((item) => (item === undefined ? null : toPrismaInputJsonNode(item)));
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, item]) => item !== undefined)
      .map(([key, item]) => [key, toPrismaInputJsonNode(item)]);

    return Object.fromEntries(entries) as Prisma.InputJsonObject;
  }

  return null;
};

export const toPrismaInputJson = (
  value: unknown,
  fallback: Prisma.InputJsonValue = [],
): Prisma.InputJsonValue => {
  return toPrismaInputJsonNode(value) ?? fallback;
};
