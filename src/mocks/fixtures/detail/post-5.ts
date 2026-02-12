export const POST_DETAIL_005 = {
  id: 5,
  body: [
    {
      type: 'heading',
      props: { level: 1 },
      content: [
        { type: 'text', text: 'shadcn/ui Avatar 컴포넌트 커스터마이징: 성능과 안정성을 위한 가이드', styles: {} },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '사용자 아바타는 단순한 시각 요소처럼 보이지만, 대규모 목록 렌더링 시 네트워크 병목과 레이아웃 시프트(CLS)의 주범이 되기도 합니다. 본 포스트에서는 shadcn/ui의 Avatar 컴포넌트를 기반으로 실무에서 즉시 적용 가능한 최적화 기법을 다룹니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'image',
      props: {
        url: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=600&fit=crop',
        caption: '프론트엔드 아키텍처와 컴포넌트 설계',
      },
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '1. 문제 배경: 아바타 렌더링의 성능 병목과 워터폴 현상', styles: {} }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '리스트 페이지에서 수십 개의 아바타를 동시에 로드할 경우, 브라우저의 도메인당 동시 연결 제한(보통 6개)으로 인해 이미지 로딩 워터폴 현상이 발생합니다. 이는 LCP(Largest Contentful Paint)를 평균 0.8초 이상 지연시키며, 로딩 전후의 레이아웃 변화로 인해 CLS 수치를 0.1 이상 증가시킬 수 있습니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '2. 선택 기준: UI 요구사항에 따른 Fallback 전략 비교', styles: {} }],
    },
    {
      type: 'table',
      content: {
        type: 'tableContent',
        rows: [
          {
            cells: [
              [{ type: 'text', text: '전략', styles: { bold: true } }],
              [{ type: 'text', text: '적용 상황', styles: { bold: true } }],
              [{ type: 'text', text: '성능 영향', styles: { bold: true } }],
              [{ type: 'text', text: '사용자 경험', styles: { bold: true } }],
            ],
          },
          {
            cells: [
              [{ type: 'text', text: 'Skeleton UI', styles: {} }],
              [{ type: 'text', text: '초기 데이터 로딩 중', styles: {} }],
              [{ type: 'text', text: 'CLS 0.01 이하 유지', styles: {} }],
              [{ type: 'text', text: '콘텐츠 로드 중임을 명확히 인지', styles: {} }],
            ],
          },
          {
            cells: [
              [{ type: 'text', text: 'Initials Fallback', styles: {} }],
              [{ type: 'text', text: '이미지 주소 없음/실패', styles: {} }],
              [{ type: 'text', text: '추가 네트워크 불필요', styles: {} }],
              [{ type: 'text', text: '사용자 식별성 100% 확보', styles: {} }],
            ],
          },
          {
            cells: [
              [{ type: 'text', text: 'Default Icon', styles: {} }],
              [{ type: 'text', text: '익명 사용자/전체 실패', styles: {} }],
              [{ type: 'text', text: 'Payload 2KB 미만', styles: {} }],
              [{ type: 'text', text: '일관된 시각적 형태 제공', styles: {} }],
            ],
          },
        ],
      },
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '3. 구현 예시: Variant 기반의 확장형 Avatar 설계', styles: {} }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'class-variance-authority(cva)를 활용하여 프로젝트의 디자인 시스템에 맞춘 사이즈 변형과 로딩 상태 관리를 단일 컴포넌트 내에서 제어합니다.',
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
          text: "import { cva, type VariantProps } from 'class-variance-authority';\n\nconst avatarVariants = cva(\n  'relative flex shrink-0 overflow-hidden rounded-full',\n  {\n    variants: {\n      size: {\n        sm: 'h-8 w-8 text-xs',\n        md: 'h-10 w-10 text-sm',\n        lg: 'h-12 w-12 text-base',\n        xl: 'h-16 w-16 text-lg',\n      },\n    },\n    defaultVariants: {\n      size: 'md',\n    },\n  }\n);",
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '이미지 로드 실패 시 Partial Success를 보장하기 위해 Error State를 관리하고, 2단계 Fallback 로직을 구현합니다.',
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
          text: 'export const CustomAvatar = ({ src, fallback, size, ...props }: AvatarProps) => {\n  const [isError, setIsError] = useState(false);\n\n  return (\n    <Avatar className={avatarVariants({ size })} {...props}>\n      {!isError && <AvatarImage src={src} onError={() => setIsError(true)} />}\n      <AvatarFallback className="bg-muted animate-in fade-in">\n        {fallback || <DefaultUserIcon />}\n      </AvatarFallback>\n    </Avatar>\n  );\n};',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '4. 운영 체크포인트: 캐싱과 접근성 최적화', styles: {} }],
    },
    {
      type: 'bulletListItem',
      content: [
        {
          type: 'text',
          text: 'CDN Edge 캐싱: 이미지 URL에 대해 Cache-Control: max-age=31536000 설정을 확인하여 TTFB를 200ms 이하로 단축합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      content: [
        {
          type: 'text',
          text: '이미지 포맷 최적화: WebP 또는 AVIF 포맷을 우선적으로 서빙하여 전체 이미지 페이로드를 30KB에서 8KB 수준으로 70% 이상 절감합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      content: [
        {
          type: 'text',
          text: 'A11y(접근성): 스크린 리더 사용자를 위해 aria-label을 부여하고, 이미지 로딩 실패 시에도 의미 있는 텍스트가 전달되도록 구성합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '5. 실패 사례: 무분별한 클라이언트 사이드 조인', styles: {} }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '흔히 하는 실수 중 하나는 아바타 이미지 정보를 가져오기 위해 리스트의 각 아이템에서 개별 useQuery를 호출하는 것입니다. 이는 네트워크 탭에 수십 개의 요청이 찍히는 N+1 문제를 유발하며, 클라이언트 메인 스레드 점유율을 20% 이상 상승시켜 스크롤 시 버벅임(Jank)을 발생시킵니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'image',
      props: {
        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
        caption: '네트워크 성능 모니터링 대시보드',
      },
    },
    {
      type: 'heading',
      props: { level: 2 },
      content: [{ type: 'text', text: '6. 최종 적용 체크리스트', styles: {} }],
    },
    {
      type: 'checkListItem',
      props: { checked: false },
      content: [
        {
          type: 'text',
          text: '모든 아바타 사이즈 variant가 고정 width/height를 가져 CLS 수치가 0.05 이하인가?',
          styles: {},
        },
      ],
    },
    {
      type: 'checkListItem',
      props: { checked: false },
      content: [
        {
          type: 'text',
          text: '이미지 로드 실패 핸들러(onError)가 정상 작동하여 Fallback UI가 노출되는가?',
          styles: {},
        },
      ],
    },
    {
      type: 'checkListItem',
      props: { checked: false },
      content: [
        {
          type: 'text',
          text: '다크 모드에서의 배경색 대비(Contrast Ratio)가 최소 4.5:1 이상을 유지하는가?',
          styles: {},
        },
      ],
    },
    {
      type: 'numberedListItem',
      content: [
        {
          type: 'text',
          text: 'shadcn/ui의 기본 Avatar 구조를 components/ui에 복제합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'numberedListItem',
      content: [
        {
          type: 'text',
          text: 'cva를 사용하여 디자인 가이드에 정의된 4종 이상의 사이즈 variants를 추가합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'numberedListItem',
      content: [
        {
          type: 'text',
          text: 'Sentry 등의 에러 트래킹 도구와 연동하여 아바타 로드 실패율을 모니터링합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '아바타는 작은 컴포넌트이지만, 실무 밀도가 높은 최적화 기법을 적용했을 때 사용자 경험에 미치는 영향은 매우 큽니다. 위 가이드를 통해 더 견고한 인터페이스를 구축해 보시기 바랍니다.',
          styles: {},
        },
      ],
    },
  ],
};
