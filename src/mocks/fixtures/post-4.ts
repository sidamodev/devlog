export const POST_DETAIL_004 = {
  id: 4,
  body: [
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '문제 배경: 프론트엔드에서 마주하는 네트워크 워터폴', styles: {} }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "프론트엔드에서 리스트 페이지를 구현할 때, 목록 API 응답에 포함되지 않은 상세 정보(예: 유저 프로필, 실시간 재고 상태)를 렌더링하기 위해 각 아이템마다 추가 API를 호출하는 상황이 빈번하다. 이를 '프론트엔드 N+1 문제'라 정의한다.",
          styles: {},
        },
      ],
    },
    {
      type: 'quote',
      content: [
        {
          type: 'text',
          text: '브라우저의 동시 연결 수 제한(Chrome 기준 도메인당 6개)으로 인해, N개의 상세 API 호출은 네트워크 큐잉(Queueing)을 유발하며 전체 로딩 시간을 선형적으로 증가시킨다.',
          styles: {},
        },
      ],
    },
    {
      type: 'image',
      props: {
        url: 'https://plus.unsplash.com/premium_photo-1661884387998-8780d834c258?q=80&w=800&auto=format&fit=crop',
        caption: '이미지: API 호출이 순차적으로 밀리는 Waterfall 현상 시각화',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '선택 기준: API 설계 전략 비교', styles: {} }],
    },
    {
      type: 'table',
      content: {
        type: 'tableContent',
        rows: [
          {
            cells: [
              [{ type: 'text', text: '전략', styles: { bold: true } }],
              [{ type: 'text', text: '장점', styles: { bold: true } }],
              [{ type: 'text', text: '단점', styles: { bold: true } }],
              [{ type: 'text', text: '적합한 상황', styles: { bold: true } }],
            ],
          },
          {
            cells: [
              [{ type: 'text', text: 'Embed(Join)', styles: {} }],
              [{ type: 'text', text: '단일 요청으로 해결', styles: {} }],
              [{ type: 'text', text: '백엔드 연산 부하 증가', styles: {} }],
              [{ type: 'text', text: '데이터 관계가 고정적인 경우', styles: {} }],
            ],
          },
          {
            cells: [
              [{ type: 'text', text: 'BFF 패턴', styles: {} }],
              [{ type: 'text', text: '클라이언트 최적화 응답', styles: {} }],
              [{ type: 'text', text: '별도 서버 운영 비용', styles: {} }],
              [{ type: 'text', text: '다양한 플랫폼(iOS/Web) 지원 시', styles: {} }],
            ],
          },
          {
            cells: [
              [{ type: 'text', text: 'Bulk Fetch', styles: {} }],
              [{ type: 'text', text: '구현이 간단함', styles: {} }],
              [{ type: 'text', text: 'URL 길이 제한 가능성', styles: {} }],
              [{ type: 'text', text: 'ID 리스트 기반 조회 시', styles: {} }],
            ],
          },
        ],
      },
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: "의사결정의 핵심은 '데이터 갱신 주기'와 '네트워크 오버헤드'의 트레이드오프를 계산하는 것이다. API 응답 크기가 100KB를 초과하더라도 20번의 RTT(Round Trip Time)를 발생하는 것보다 단일 호출이 유리한 경우가 많다.",
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '구현 예시: BFF를 활용한 데이터 애그리게이션', styles: {} }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '클라이언트에서 복잡한 조합 로직을 제거하고, BFF 계층에서 병렬적으로 데이터를 조회하여 가공하는 TypeScript 예시이다.',
          styles: {},
        },
      ],
    },
    {
      type: 'codeBlock',
      props: { language: 'typescript' },
      content: [
        {
          type: 'text',
          text: 'async function getDashboardData(userId: string): Promise<DashboardResponse> {\n const basicInfo = await db.users.findUnique({ where: { id: userId } });\n \n // N+1 문제를 방지하기 위해 상세 정보를 개별 호출하지 않고,\n // In-clause 등을 이용해 한 번에 쿼리하거나 병렬 처리한다.\n const [posts, followers] = await Promise.all([\n db.posts.findMany({ where: { authorId: userId }, take: 10 }),\n db.follows.count({ where: { followingId: userId } })\n ]);\n\n return { ...basicInfo, posts, followerCount: followers };\n}',
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '응답 데이터는 프론트엔드 UI 컴포넌트 구조에 최적화된 JSON 형태로 전달되어야 한다.',
          styles: {},
        },
      ],
    },
    {
      type: 'codeBlock',
      props: { language: 'json' },
      content: [
        {
          type: 'text',
          text: '{\\n  "user": { "id": "u1", "name": "Senior Dev" },\\n  "contentList": [\\n    { "id": "p1", "title": "N+1 Guide", "likeCount": 42 },\\n    { "id": "p2", "title": "BFF Pattern", "likeCount": 128 }\\n  ],\\n  "metadata": { "totalCount": 2 }\\n}',
          styles: {},
        },
      ],
    },
    {
      type: 'divider',
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '운영 및 성능 관점의 체크포인트', styles: {} }],
    },
    {
      type: 'numberedListItem',
      content: [
        {
          type: 'text',
          text: 'HTTP/2 이상 사용 여부: HTTP/2는 멀티플렉싱을 지원하지만, 여전히 서버 리소스 경합 문제는 남으므로 무분별한 호출은 지양해야 한다.',
          styles: {},
        },
      ],
    },
    {
      type: 'numberedListItem',
      content: [
        {
          type: 'text',
          text: 'Cache-Control 전략: 리스트 전체 데이터와 상세 데이터의 TTL(Time To Live)이 다를 경우, 통합 API 응답의 캐시 효율이 떨어질 수 있다.',
          styles: {},
        },
      ],
    },
    {
      type: 'numberedListItem',
      content: [
        {
          type: 'text',
          text: '부분 실패 대응: 애그리게이션 API에서 일부 데이터 소스가 응답하지 않을 때, 전체를 에러로 처리할지 null로 반환할지 정의해야 한다.',
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '실무에서는 성능 지표로 LCP(Largest Contentful Paint)를 모니터링하며, API 병합 전후의 수치 변화를 측정하는 것이 필수적이다.',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '실패 사례 및 회피 전략', styles: {} }],
    },
    {
      type: 'quote',
      content: [
        {
          type: 'text',
          text: "가장 흔한 실수는 컴포넌트 단위의 독립성을 위해 각 컴포넌트 내부에서 'useQuery'를 남발하여 의도치 않은 워터폴을 만드는 것이다.",
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      content: [
        {
          type: 'text',
          text: '과도한 오버페칭(Over-fetching): N+1을 피하기 위해 모든 필드를 한 API에 몰아넣으면 페이로드 크기가 커져 초기 렌더링 속도가 저하된다.',
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      content: [
        {
          type: 'text',
          text: '잘못된 Bulk 쿼리: GET /api/details?ids=1,2,3...100 형태는 URL 길이 제한(일반적으로 2,000자 내외)에 걸릴 위험이 있다.',
          styles: {},
        },
      ],
    },
    {
      type: 'image',
      props: {
        url: 'https://plus.unsplash.com/premium_photo-1670210080052-2fbd0ef2a3ad?fm=jpg&q=60&w=800&auto=format&fit=crop',
        caption: '이미지: 과도한 페이로드로 인한 TBT(Total Blocking Time) 증가와 메인 스레드 부하',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '정리 및 적용 체크리스트', styles: {} }],
    },
    {
      type: 'bulletListItem',
      content: [
        { type: 'text', text: '리스트 렌더링 시 발생하는 HTTP 요청 수가 페이지당 10개를 초과하는가?', styles: {} },
      ],
    },
    {
      type: 'bulletListItem',
      content: [
        { type: 'text', text: 'BFF 또는 전용 Aggregator End-point를 통해 API를 병합할 수 있는 구조인가?', styles: {} },
      ],
    },
    {
      type: 'bulletListItem',
      content: [
        {
          type: 'text',
          text: '병합된 API가 부분 실패(Partial Failure)를 허용하며 적절한 Fallback 데이터를 제공하는가?',
          styles: {},
        },
      ],
    },
  ],
};
