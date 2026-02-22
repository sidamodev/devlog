import { getPostListResponse } from '@/features/posts/server/service';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export const GET = async (request: NextRequest) => {
  const response = await getPostListResponse(request.nextUrl.searchParams.get('cursor') ?? undefined);
  return NextResponse.json(response);
};
