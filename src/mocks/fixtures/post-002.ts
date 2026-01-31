export const POST_DETAIL_002 = {
  // PostSummary 필드 (동일)
  id: 'post-002',
  title: 'React Query vs SWR: 실무에서 선택 기준',
  slug: 'react-query-vs-swr-실무에서-선택-기준',
  authorId: 'user-032',
  author: {
    id: 'user-032',
    username: 'frontendlee',
    nickname: 'Frontend Lee',
    avatar: 'https://i.pravatar.cc/96?img=32',
  },
  createdAt: '2025-12-20',
  image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
  description:
    '데이터 동기화, 캐시 무효화, mutation 처리 관점에서 어떤 팀/프로덕트에 어떤 선택이 맞는지 비교해봤습니다.',
  likes: 76,
  comments: 19,
  bookmarks: 5,
  readingTime: 12,

  // BlockNote defaultBlockSpecs 형태 (table 제거, 단순화)
  content: [
    {
      id: 'cover-image-block',
      type: 'image',
      props: {
        url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80',
        caption: 'Image Caption',
        previewWidth: 1024,
      },
      children: [],
    },
    {
      id: 'intro-block',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '최근 프로젝트에서 데이터 페칭 라이브러리를 선택하면서, React Query와 SWR 사이에서 고민이 많았습니다. ',
          styles: {},
        },
        {
          type: 'text',
          text: '어떤 상황에서 어떤 선택이 적절한지',
          styles: { bold: true },
        },
        {
          type: 'text',
          text: ' 명확한 기준이 필요했고, 6개월간의 프로덕션 경험을 바탕으로 정리해봤습니다.',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'quote',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'The best architecture is the one that allows your team to move fast while maintaining code quality. It should be invisible to new developers—intuitive enough that the right patterns feel obvious.',
          styles: { italic: true },
        },
      ],
      children: [],
    },
    {
      id: 'heading-1',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [{ type: 'text', text: '기본 특징 비교', styles: {} }],
      children: [],
    },
    {
      id: 'comparison-list',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '번들 크기: React Query ~13KB, SWR ~5KB (gzipped)',
          styles: { bold: true },
        },
      ],
      children: [],
    },
    {
      id: 'comparison-2',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'DevTools: React Query는 별도 패키지 제공, SWR은 기본 없음',
          styles: { bold: true },
        },
      ],
      children: [],
    },
    {
      id: 'comparison-3',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Mutation: React Query는 useMutation + 낙관적 업데이트, SWR은 mutate 수동 관리',
          styles: { bold: true },
        },
      ],
      children: [],
    },
    {
      id: 'comparison-4',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '학습 곡선: React Query 중~높음, SWR 낮음',
          styles: { bold: true },
        },
      ],
      children: [],
    },
    {
      id: 'heading-2',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [{ type: 'text', text: '1. 데이터 동기화 전략', styles: {} }],
      children: [],
    },
    {
      id: 'rq-sync',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [{ type: 'text', text: 'React Query: 세밀한 제어', styles: {} }],
      children: [],
    },
    {
      id: 'rq-code',
      type: 'codeBlock',
      props: {
        language: 'typescript',
      },
      content: [
        {
          type: 'text',
          text: `const { data } = useQuery({
  queryKey: ['posts', filters],
  queryFn: fetchPosts,
  staleTime: 5 * 60 * 1000, // 5분간 fresh 유지
  gcTime: 10 * 60 * 1000,   // 10분 캐시 보관
  refetchOnWindowFocus: false, // 탭 전환 시 재요청 OFF
});`,
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'rq-desc',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'staleTime/gcTime 분리로 "언제 refetch"와 "언제 메모리 제거"를 독립 제어할 수 있습니다. 대시보드처럼 ',
          styles: {},
        },
        {
          type: 'text',
          text: '실시간성이 중요하지만 캐시도 오래 유지하고 싶은 케이스',
          styles: { italic: true },
        },
        {
          type: 'text',
          text: '에 유리합니다.',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'swr-sync',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [{ type: 'text', text: 'SWR: 심플한 재검증', styles: {} }],
      children: [],
    },
    {
      id: 'swr-code',
      type: 'codeBlock',
      props: {
        language: 'typescript',
      },
      content: [
        {
          type: 'text',
          text: `const { data } = useSWR('/api/posts', fetcher, {
  dedupingInterval: 2000,        // 2초 내 중복 요청 무시
  revalidateOnFocus: true,       // 탭 복귀 시 자동 갱신
  refreshInterval: 30000,        // 30초마다 폴링
});`,
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'heading-3',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [{ type: 'text', text: '2. Mutation & 낙관적 업데이트', styles: {} }],
      children: [],
    },
    {
      id: 'mutation-intro',
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'CUD 작업이 많은 프로덕트라면 React Query의 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'useMutation',
          styles: { code: true },
        },
        {
          type: 'text',
          text: ' API가 압도적으로 편리합니다.',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'mutation-rq-code',
      type: 'codeBlock',
      props: {
        language: 'typescript',
      },
      content: [
        {
          type: 'text',
          text: `const mutation = useMutation({
  mutationFn: updatePost,
  onMutate: async (newData) => {
    await queryClient.cancelQueries({ queryKey: ['posts'] });
    const prev = queryClient.getQueryData(['posts']);
    queryClient.setQueryData(['posts'], (old) => [...old, newData]);
    return { prev };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['posts'], context.prev);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  },
});`,
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'mutation-benefit-1',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '낙관적 업데이트 → 실패 시 롤백 → 최종 재검증 라이프사이클 명확',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'mutation-benefit-2',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'cancelQueries로 race condition 방지',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'heading-4',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [{ type: 'text', text: '3. 캐시 무효화 전략', styles: {} }],
      children: [],
    },
    {
      id: 'cache-rq-code',
      type: 'codeBlock',
      props: {
        language: 'typescript',
      },
      content: [
        {
          type: 'text',
          text: `// React Query: 와일드카드 무효화
queryClient.invalidateQueries({ queryKey: ['posts'] }); 
// ['posts'], ['posts', id], ['posts', id, 'comments'] 모두 무효화`,
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'cache-swr-code',
      type: 'codeBlock',
      props: {
        language: 'typescript',
      },
      content: [
        {
          type: 'text',
          text: `// SWR: 개별 키 수동 무효화
mutate('/api/posts');
mutate(\`/api/posts/\${id}\`);`,
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'heading-5',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [{ type: 'text', text: '실무 선택 기준', styles: {} }],
      children: [],
    },
    {
      id: 'conclusion-rq',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [{ type: 'text', text: 'React Query 선택 기준', styles: {} }],
      children: [],
    },
    {
      id: 'rq-1',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'CUD 작업 빈번한 어드민/대시보드',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'rq-2',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '복잡한 캐시 무효화 (다중 엔드포인트)',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'rq-3',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Pagination/Infinite Scroll',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'conclusion-swr',
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 3,
      },
      content: [{ type: 'text', text: 'SWR 선택 기준', styles: {} }],
      children: [],
    },
    {
      id: 'swr-1',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '읽기 위주 애플리케이션',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'swr-2',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Next.js SSR 연동 간편',
          styles: {},
        },
      ],
      children: [],
    },
    {
      id: 'swr-3',
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '번들 크기 중요 (모바일)',
          styles: {},
        },
      ],
      children: [],
    },
  ],

  relatedPosts: [
    // (이전과 동일)
  ],
};
