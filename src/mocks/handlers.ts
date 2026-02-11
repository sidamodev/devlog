import { POST_LIST_FIXTURE } from '@/mocks/fixtures/post-list';
import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PAGE_SIZE = 20;

export const handlers = [
  http.get(`${API_URL}/`, ({ request }) => {
    const url = new URL(request.url);
    const qs = url.searchParams.get('cursor');
    const cursor = qs ? Number(atob(qs)) : 0;

    const start = cursor * PAGE_SIZE;
    const fixtureLen = POST_LIST_FIXTURE.length;
    const data = Array.from({ length: PAGE_SIZE }, (_, i) => {
      const offset = start + i;
      const base = POST_LIST_FIXTURE[offset % fixtureLen];

      return {
        ...base,
        id: offset + 1,
      };
    });
    return HttpResponse.json({
      pageInfo: {
        nextCursor: btoa(String(cursor + 1)),
        hasNextPage: true,
        count: PAGE_SIZE,
      },
      data,
    });
  }),
];
