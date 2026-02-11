export const POST_DETAIL_003 = {
  id: 3,
  content: [
    {
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: '가변 콘텐츠와 레이아웃 파편화 문제',
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: "대시보드 위젯이나 이커머스 상품 리스트 UI를 설계할 때, 가장 흔하게 발생하는 문제는 데이터 길이에 따른 '카드 높이 불일치'입니다. 제목이 1줄인 카드와 3줄인 카드가 섞여 있을 때, 단순히 ",
          styles: {},
        },
        {
          type: 'text',
          text: 'min-height',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '를 고정하면 내부 여백(white space)이 불규칙해져 시각적 균형이 깨집니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '반대로 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'height',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '를 강제하고 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'overflow: hidden',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '을 적용하면 글자가 반쯤 잘린 채로 렌더링되는 문제가 발생합니다. 따라서 지정된 줄 수까지만 노출하고 말줄임표(...)를 자동으로 처리하는 전략이 필요합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: '기술 선택: JS Truncation vs CSS line-clamp',
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'JS Truncation: 문자열 길이를 계산하여 자르는 방식은 React의 Hydration 과정에서 서버와 클라이언트 간 텍스트 불일치 오류를 유발할 수 있습니다. 또한 폰트 로딩 시점에 따라 CLS(Cumulative Layout Shift) 점수에 악영향을 줍니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Tailwind line-clamp: CSS 표준 속성인 ',
          styles: {},
        },
        {
          type: 'text',
          text: '-webkit-line-clamp',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '를 유틸리티로 추상화하여, 렌더링 성능 저하 없이 즉각적인 시각적 처리가 가능합니다. 브라우저 엔진 레벨에서 텍스트를 처리하므로 스크립트 실행 비용이 없습니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: '구현 예시: Grid와 Flexbox 조합',
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '단순히 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'line-clamp',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '만 적용해서는 카드의 전체 높이를 맞출 수 없습니다. ',
          styles: {},
        },
        {
          type: 'text',
          text: 'grid-auto-rows',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '와 Flexbox의 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'flex-1',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: ' 속성을 함께 사용하여 레이아웃을 강제해야 합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'codeBlock',
      props: {
        language: 'tsx',
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'export const CardList = ({ items }: { items: Article[] }) => {\n return (\n // auto-rows-fr: 모든 행의 높이를 가장 긴 카드(콘텐츠)에 맞춤\n <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">\n {items.map((item) => (\n <article \n key={item.id} \n className="flex flex-col bg-white p-4 border rounded-lg h-full"\n >\n {/* 제목: 최대 2줄, 넘치면 ... 처리 */}\n <h3 className="text-lg font-bold line-clamp-2 mb-2 min-h-[3.5rem]">\n {item.title}\n </h3>\n \n {/* 본문: 남는 공간 채우기(flex-1), 최대 3줄 노출 */}\n <p className="text-gray-600 flex-1 line-clamp-3 mb-4">\n {item.description}\n </p>\n \n {/* 하단 영역: 항상 바닥에 고정 */}\n <div className="pt-4 border-t text-sm text-gray-400">\n {item.date}\n </div>\n </article>\n ))}\n </div>\n );\n};',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: '운영 및 성능 관점 체크포인트',
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Tailwind v3.3 이상부터는 ',
          styles: {},
        },
        {
          type: 'text',
          text: '@tailwindcss/line-clamp',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: ' 플러그인이 코어에 통합되었습니다. 레거시 프로젝트(v3.2 이하)를 운영 중이라면 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'tailwind.config.js',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: ' 설정을 확인해야 스타일이 깨지지 않습니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'codeBlock',
      props: {
        language: 'javascript',
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: "// Tailwind v3.2 이하일 경우 필수 설정\nmodule.exports = {\n // ...\n plugins: [\n require('@tailwindcss/line-clamp'),\n ],\n}",
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '또한, ',
          styles: {},
        },
        {
          type: 'text',
          text: 'line-clamp',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '는 시각적으로만 텍스트를 감추며 실제 DOM에는 전체 텍스트가 존재합니다. 이는 SEO 크롤러가 전체 내용을 수집하는 데 유리하지만, 스크린 리더 사용자는 요약된 정보가 아닌 전체 텍스트를 듣게 되므로 UX 기획 단계에서 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'aria-label',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: ' 활용 여부를 결정해야 합니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: '실패 사례 및 회피 전략',
          styles: {},
        },
      ],
    },
    {
      type: 'quote',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'line-clamp를 적용했는데 Row마다 카드 높이가 제각각입니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'paragraph',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '가장 흔한 실패 원인은 Grid 컨테이너에 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'auto-rows-fr',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '을 누락하고, 자식 카드 컴포넌트에 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'h-full',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '을 주지 않았을 때 발생합니다. 텍스트가 2줄에서 잘리더라도 카드가 늘어날 공간이 확보되지 않으면 UI가 찌그러집니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'codeBlock',
      props: {
        language: 'css',
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '/ 잘못된 구현: 높이 동기화 실패 /\n.card-grid {\n display: grid;\n / auto-rows-fr 누락됨 /\n}\n\n.card {\n / h-full 누락됨 -> 콘텐츠 양만큼만 높이 차지 */\n @apply flex flex-col p-4;\n}',
          styles: {},
        },
      ],
    },
    {
      type: 'heading',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: '적용 체크리스트',
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Tailwind CSS 버전을 확인하고, v3.3 미만이라면 플러그인 설정 유무를 검증한다.',
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Grid 부모 컨테이너에 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'auto-rows-fr',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: ' 클래스를 적용하여 행 높이 동기화를 수행했는지 확인한다.',
          styles: {},
        },
      ],
    },
    {
      type: 'bulletListItem',
      props: {
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '개별 카드 컴포넌트에 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'h-full',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '과 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'flex-col',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '을 선언하고, 가변 영역에 ',
          styles: {},
        },
        {
          type: 'text',
          text: 'flex-1',
          styles: {
            code: true,
          },
        },
        {
          type: 'text',
          text: '을 적용했는지 점검한다.',
          styles: {},
        },
      ],
    },
  ],
};
