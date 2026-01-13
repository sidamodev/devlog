import { POST_LIST_FIXTURE } from '@/mocks/fixtures/post-list';
import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const handlers = [
  http.get(`${API_URL}/`, () => {
    return HttpResponse.json({
      pageInfo: {
        nextCursor: 'base64-encoded',
        hasNextPage: true,
      },
      data: POST_LIST_FIXTURE,
    });
  }),
];
