import { POST_LIST_FIXTURE } from '@/mocks/fixtures/post-list';
import { http, HttpResponse } from 'msw';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

let id = 0;

export const handlers = [
  // PostList 무한스크롤
  http.get(`${API_URL}/`, () => {
    return HttpResponse.json({
      pageInfo: {
        nextCursor: 'base64-encoded',
        hasNextPage: true,
      },
      data: POST_LIST_FIXTURE.map((post) => ({
        ...post,
        id: `post-${id++}`,
      })),
    });
  }),
];
