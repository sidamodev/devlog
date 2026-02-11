type PostFixtureAuthor = {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
};

type PostFixtureBase = {
  id: number;
  title: string;
  slug: string;
  authorId: number;
  author: PostFixtureAuthor;
  createdAt: string;
  thumbnail: string;
  description: string;
  likeCount: number;
  commentCount: number;
  bookmarkCount: number;
};

export type PostFixture = PostFixtureBase & {
  content: unknown[];
  readingTime: number;
  updatedAt: string;
};

const BASE_POST_LIST_FIXTURE: Readonly<PostFixtureBase[]> = [
  {
    id: 1,
    title: 'Next.js App Router에서 Server Actions로 폼 처리하기',
    slug: 'nextjs-app-router에서-server-actions로-폼-처리하기',
    authorId: 12,
    author: {
      id: 12,
      username: 'kimdev',
      nickname: 'Kim Dev',
      avatar: 'https://i.pravatar.cc/96?img=12',
    },
    createdAt: '2025-12-24',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    description:
      'Server Actions를 적용하면서 생기는 캐싱/리밸리데이션 포인트와, 클라이언트 폼과 결합할 때의 패턴을 정리했습니다.',
    likeCount: 128,
    commentCount: 34,
    bookmarkCount: 10,
  },
  {
    id: 2,
    title: 'React Query vs SWR: 실무에서 선택 기준',
    slug: 'react-query-vs-swr-실무에서-선택-기준',
    authorId: 32,
    author: {
      id: 32,
      username: 'frontendlee',
      nickname: 'Frontend Lee',
      avatar: 'https://i.pravatar.cc/96?img=32',
    },
    createdAt: '2025-12-20',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
    description:
      '데이터 동기화, 캐시 무효화, mutation 처리 관점에서 어떤 팀/프로덕트에 어떤 선택이 맞는지 비교해봤습니다.',
    likeCount: 76,
    commentCount: 19,
    bookmarkCount: 5,
  },
  {
    id: 3,
    title: 'Tailwind로 line-clamp와 카드 레이아웃 깔끔하게 잡기',
    slug: 'tailwind로-line-clamp와-카드-레이아웃-깔끔하게-잡기',
    authorId: 47,
    author: {
      id: 47,
      username: 'jiyoonpark',
      nickname: 'Jiyoon Park',
      avatar: 'https://i.pravatar.cc/96?img=47',
    },
    createdAt: '2025-12-18',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description:
      '카드형 리스트에서 제목/본문 길이가 제각각일 때 높이 튐을 줄이는 구성과 유틸 조합을 예제로 공유합니다.',
    likeCount: 52,
    commentCount: 11,
    bookmarkCount: 13,
  },
  {
    id: 4,
    title: 'N+1 문제를 프론트에서 체감하는 순간들',
    slug: 'n+1-문제를-프론트에서-체감하는-순간들',
    authorId: 8,
    author: {
      id: 8,
      username: 'minsuchoi',
      nickname: 'Minsu Choi',
      avatar: 'https://i.pravatar.cc/96?img=8',
    },
    createdAt: '2025-12-15',
    thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80',
    description:
      '리스트 + 상세 정보 조합에서 API를 어떻게 설계/호출해야 병목이 안 생기는지, BFF 패턴까지 함께 정리했습니다.',
    likeCount: 201,
    commentCount: 58,
    bookmarkCount: 16,
  },
  {
    id: 5,
    title: 'shadcn/ui Avatar 컴포넌트 커스터마이징 팁',
    slug: 'shadcnui-avatar-컴포넌트-커스터마이징-팁',
    authorId: 15,
    author: {
      id: 15,
      username: 'devpark',
      nickname: 'Dev Park',
      avatar: 'https://i.pravatar.cc/96?img=15',
    },
    createdAt: '2025-12-10',
    thumbnail: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=600&q=80',
    description:
      'Fallback 처리, 이미지 로딩 실패 대응, 사이즈 variants 구성 등 Avatar를 프로젝트 스타일에 맞추는 방법을 정리했습니다.',
    likeCount: 33,
    commentCount: 7,
    bookmarkCount: 1,
  },
  {
    id: 6,
    title: 'Next.js에서 이미지 최적화: next/image 실전 체크리스트',
    slug: 'nextjs에서-이미지-최적화-nextimage-실전-체크리스트',
    authorId: 22,
    author: {
      id: 22,
      username: 'sorakim',
      nickname: 'Sora Kim',
      avatar: 'https://i.pravatar.cc/96?img=22',
    },
    createdAt: '2025-12-08',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    description:
      'LCP 개선을 위해 sizes, priority, placeholder, 원본 이미지 품질까지 어떤 순서로 점검하면 좋은지 정리했습니다.',
    likeCount: 64,
    commentCount: 14,
    bookmarkCount: 9,
  },
  {
    id: 7,
    title: 'React 19 관점에서 본 useActionState 패턴',
    slug: 'react-19-관점에서-본-useactionstate-패턴',
    authorId: 5,
    author: {
      id: 5,
      username: 'hoonjeong',
      nickname: 'Hoon Jeong',
      avatar: 'https://i.pravatar.cc/96?img=5',
    },
    createdAt: '2025-12-06',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1000&auto=format&fit=crop&q=60',
    description:
      '폼 제출 상태/에러/성공을 서버 액션과 함께 다룰 때 상태 모델을 어떻게 잡는지 예제 중심으로 설명합니다.',
    likeCount: 91,
    commentCount: 21,
    bookmarkCount: 12,
  },
  {
    id: 8,
    title: 'TanStack Table로 대용량 리스트 렌더링 최적화',
    slug: 'tanstack-table로-대용량-리스트-렌더링-최적화',
    authorId: 41,
    author: {
      id: 41,
      username: 'eunjihan',
      nickname: 'Eunji Han',
      avatar: 'https://i.pravatar.cc/96?img=41',
    },
    createdAt: '2025-12-04',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    description:
      '가상 스크롤, 컬럼 메모이제이션, 서버 페이징을 조합해 1만 건 이상에서도 UI가 버벅이지 않게 만든 경험을 공유합니다.',
    likeCount: 143,
    commentCount: 37,
    bookmarkCount: 18,
  },
  {
    id: 9,
    title: 'Zod 스키마로 폼 검증과 API 타입을 한 번에 맞추기',
    slug: 'zod-스키마로-폼-검증과-api-타입을-한-번에-맞추기',
    authorId: 18,
    author: {
      id: 18,
      username: 'taehyunlim',
      nickname: 'Taehyun Lim',
      avatar: 'https://i.pravatar.cc/96?img=18',
    },
    createdAt: '2025-12-02',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
    description:
      '폼에서 쓰는 validation을 API request/response 타입과 싱크시키는 방법과, 공통 스키마 분리 전략을 정리했습니다.',
    likeCount: 57,
    commentCount: 10,
    bookmarkCount: 7,
  },
  {
    id: 10,
    title: 'CSR/SSR/SSG/ISR: 팀에서 합의한 렌더링 선택 기준',
    slug: 'csrssrssgisr-팀에서-합의한-렌더링-선택-기준',
    authorId: 29,
    author: {
      id: 29,
      username: 'hyunwooseo',
      nickname: 'Hyunwoo Seo',
      avatar: 'https://i.pravatar.cc/96?img=29',
    },
    createdAt: '2025-11-30',
    thumbnail: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=600&q=80',
    description: 'SEO, TTFB, 데이터 신선도, 캐시 비용을 기준으로 페이지별 렌더링 방식을 표준화한 과정을 소개합니다.',
    likeCount: 110,
    commentCount: 26,
    bookmarkCount: 15,
  },
  {
    id: 11,
    title: 'MSW로 프론트 개발 생산성 올리기: 시나리오 기반 목킹',
    slug: 'msw로-프론트-개발-생산성-올리기-시나리오-기반-목킹',
    authorId: 52,
    author: {
      id: 52,
      username: 'jisookang',
      nickname: 'Jisoo Kang',
      avatar: 'https://i.pravatar.cc/96?img=52',
    },
    createdAt: '2025-11-28',
    thumbnail: 'https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=600&q=80',
    description:
      '성공/실패/지연 응답을 시나리오로 나눠 관리하고, 스토리북/테스트에서 동일하게 재사용하는 패턴을 정리했습니다.',
    likeCount: 88,
    commentCount: 23,
    bookmarkCount: 14,
  },
  {
    id: 12,
    title: 'Next.js App Router에서 캐시가 "안 먹는" 흔한 원인 7가지',
    slug: 'nextjs-app-router에서-캐시가-안-먹는-흔한-원인-7가지',
    authorId: 9,
    author: {
      id: 9,
      username: 'devshin',
      nickname: 'Dev Shin',
      avatar: 'https://i.pravatar.cc/96?img=9',
    },
    createdAt: '2025-11-26',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=600&q=80',
    description:
      'fetch 옵션, headers/cookies 사용, dynamic rendering 전파 등 캐시를 깨는 조건들을 체크리스트 형태로 모았습니다.',
    likeCount: 172,
    commentCount: 44,
    bookmarkCount: 22,
  },
  {
    id: 13,
    title: 'Monorepo에서 디자인 시스템 패키지 배포하기 (pnpm + changesets)',
    slug: 'monorepo에서-디자인-시스템-패키지-배포하기-pnpm-changesets',
    authorId: 36,
    author: {
      id: 36,
      username: 'hanayoo',
      nickname: 'Hana Yoo',
      avatar: 'https://i.pravatar.cc/96?img=36',
    },
    createdAt: '2025-11-24',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=600&q=80',
    description:
      '버전 관리, 릴리즈 노트, CI 파이프라인까지 포함해 사내 UI 패키지를 안정적으로 배포한 절차를 공유합니다.',
    likeCount: 95,
    commentCount: 17,
    bookmarkCount: 11,
  },
  {
    id: 14,
    title: 'React에서 "상태를 어디에 둘지" 결정하는 실무 규칙',
    slug: 'react에서-상태를-어디에-둘지-결정하는-실무-규칙',
    authorId: 25,
    author: {
      id: 25,
      username: 'minjaelee',
      nickname: 'Minjae Lee',
      avatar: 'https://i.pravatar.cc/96?img=25',
    },
    createdAt: '2025-11-22',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=600&q=80',
    description: '서버 상태/클라이언트 상태/URL 상태를 구분하고, 상태의 소유권을 결정하는 기준을 사례로 정리했습니다.',
    likeCount: 134,
    commentCount: 31,
    bookmarkCount: 19,
  },
  {
    id: 15,
    title: '웹 접근성 빠르게 개선하는 ARIA 패턴 10선',
    slug: '웹-접근성-빠르게-개선하는-aria-패턴-10선',
    authorId: 44,
    author: {
      id: 44,
      username: 'yerincho',
      nickname: 'Yerin Cho',
      avatar: 'https://i.pravatar.cc/96?img=44',
    },
    createdAt: '2025-11-20',
    thumbnail: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=600&q=80',
    description:
      'Dialog, Tabs, MenuButton 등에서 자주 깨지는 속성을 중심으로, QA에서 바로 쓸 수 있는 체크포인트를 모았습니다.',
    likeCount: 77,
    commentCount: 16,
    bookmarkCount: 20,
  },
  {
    id: 16,
    title: '프론트엔드에서 보는 인증/인가: JWT가 만능이 아닌 이유',
    slug: '프론트엔드에서-보는-인증인가-jwt가-만능이-아닌-이유',
    authorId: 6,
    author: {
      id: 6,
      username: 'donghyunkim',
      nickname: 'Donghyun Kim',
      avatar: 'https://i.pravatar.cc/96?img=6',
    },
    createdAt: '2025-11-18',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    description: '세션/쿠키, 토큰 탈취, 리프레시 토큰 회전, CSRF 대응까지 프론트 관점에서 오해를 정리했습니다.',
    likeCount: 160,
    commentCount: 42,
    bookmarkCount: 24,
  },
  {
    id: 17,
    title: 'Vite에서 환경 변수/프록시 설정을 안전하게 운영하는 법',
    slug: 'vite에서-환경-변수프록시-설정을-안전하게-운영하는-법',
    authorId: 20,
    author: {
      id: 20,
      username: 'sejinpark',
      nickname: 'Sejin Park',
      avatar: 'https://i.pravatar.cc/96?img=20',
    },
    createdAt: '2025-11-16',
    thumbnail: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=600&q=80',
    description: '개발/스테이징/프로덕션 환경 분리와, 프록시로 CORS를 우회할 때 생기는 실수 포인트를 정리했습니다.',
    likeCount: 49,
    commentCount: 8,
    bookmarkCount: 6,
  },
  {
    id: 18,
    title: 'Storybook으로 UI 회귀 테스트 루틴 만들기',
    slug: 'storybook으로-ui-회귀-테스트-루틴-만들기',
    authorId: 54,
    author: {
      id: 54,
      username: 'narijung',
      nickname: 'Nari Jung',
      avatar: 'https://i.pravatar.cc/96?img=54',
    },
    createdAt: '2025-11-14',
    thumbnail: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80',
    description:
      'Chromatic을 도입하면서 생긴 워크플로 변화와, "변경 감지" 기준을 팀 규칙으로 합의한 방법을 소개합니다.',
    likeCount: 83,
    commentCount: 12,
    bookmarkCount: 10,
  },
  {
    id: 19,
    title: 'Suspense로 로딩 UX 설계하기: 스켈레톤과 스트리밍',
    slug: 'suspense로-로딩-ux-설계하기-스켈레톤과-스트리밍',
    authorId: 13,
    author: {
      id: 13,
      username: 'aramkim',
      nickname: 'Aram Kim',
      avatar: 'https://i.pravatar.cc/96?img=13',
    },
    createdAt: '2025-11-12',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description:
      '로딩 상태를 "보여주기"가 아니라 "흐름"으로 설계하는 관점에서, 경계 설정과 폴백 구성 팁을 정리했습니다.',
    likeCount: 119,
    commentCount: 24,
    bookmarkCount: 17,
  },
  {
    id: 20,
    title: '프론트 로그/트레이싱 표준화: Sentry로 이슈 재현률 올리기',
    slug: '프론트-로그트레이싱-표준화-sentry로-이슈-재현률-올리기',
    authorId: 39,
    author: {
      id: 39,
      username: 'yonghopark',
      nickname: 'Yongho Park',
      avatar: 'https://i.pravatar.cc/96?img=39',
    },
    createdAt: '2025-11-10',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=600&q=80',
    description:
      '에러 이벤트에 어떤 context를 붙여야 재현이 쉬워지는지, breadcrumbs/태그/릴리즈 전략을 실무 기준으로 정리했습니다.',
    likeCount: 102,
    commentCount: 20,
    bookmarkCount: 13,
  },
];

const getIsoDateTime = (date: string) => `${date}T00:00:00.000Z`;

export const POST_LIST_FIXTURE: Readonly<PostFixture[]> = BASE_POST_LIST_FIXTURE.map((post) => ({
  ...post,
  content: [],
  readingTime: 5,
  createdAt: getIsoDateTime(post.createdAt),
  updatedAt: getIsoDateTime(post.createdAt),
}));
