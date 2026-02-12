export const POST_DETAIL_001 = {
  id: 1,
  body: [
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
          text: '기존 Form 처리 방식의 구조적 한계',
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
          text: 'Pages Router 시절의 폼 처리는 클라이언트 상태(useState)와 서버 API(Pages API)가 완전히 분리된 형태였습니다. 이로 인해 유효성 검사 로직이 양측에 중복되거나, 네트워크 워터폴(Waterfall) 현상으로 인해 Core Web Vitals의 FID(First Input Delay) 점수에 악영향을 주는 경우가 빈번했습니다. App Router의 Server Actions는 이 프로세스를 단일 함수 호출 흐름으로 통합하여 네트워크 라운드트립 비용을 최소화합니다.',
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
          text: 'Server Actions vs Route Handlers 선택 기준',
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
          text: '모든 POST 요청을 Server Actions로 대체해야 하는 것은 아닙니다. UI 인터랙션과 강하게 결합된 경우와 순수 데이터 처리를 구분해야 합니다.',
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
          text: 'Server Actions: 폼 제출, 버튼 클릭 등 사용자의 직접적인 액션으로 데이터 변이(Mutation)가 발생하고, 그 결과가 즉시 UI에 반영되어야 할 때 사용합니다. Progressive Enhancement를 기본 지원합니다.',
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
          text: 'Route Handlers: Webhook 수신, 외부 서비스용 REST API 제공, 혹은 UI와 무관한 백그라운드 데이터 처리 시 적합합니다.',
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
          text: '구현 패턴: useFormState와 Zod 통합',
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
          text: '실무에서는 단순 입력뿐만 아니라 서버 측 검증 실패 시 에러 메시지 반환이 필수적입니다. react-dom의 useFormState 훅을 사용하여 서버 액션의 리턴값을 클라이언트 상태와 동기화하는 패턴이 표준입니다.',
          styles: {},
        },
      ],
    },
    {
      type: 'codeBlock',
      props: {
        language: 'typescript',
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: "// app/actions.ts\n'use server';\n\nimport { z } from 'zod';\nimport { revalidatePath } from 'next/cache';\n\nconst schema = z.object({\n email: z.string().email(),\n password: z.string().min(8),\n});\n\nexport type FormState = {\n errors?: { email?: string[]; password?: string[]; _form?: string[] };\n message?: string;\n};\n\nexport async function loginAction(\n prevState: FormState,\n formData: FormData\n): Promise<FormState> {\n const validatedFields = schema.safeParse({\n email: formData.get('email'),\n password: formData.get('password'),\n });\n\n if (!validatedFields.success) {\n return {\n errors: validatedFields.error.flatten().fieldErrors,\n message: '입력값을 확인해주세요.',\n };\n }\n\n try {\n // DB Logic here\n await authService.login(validatedFields.data);\n \n revalidatePath('/dashboard'); // 중요: 데이터 갱신 후 캐시 무효화\n return { message: '로그인 성공' };\n } catch (e) {\n return { message: '서버 오류가 발생했습니다.' };\n }\n}",
          styles: {},
        },
      ],
    },
    {
      type: 'codeBlock',
      props: {
        language: 'typescript',
        textColor: 'default',
        backgroundColor: 'default',
        textAlignment: 'left',
      },
      content: [
        {
          type: 'text',
          text: '// app/login/page.tsx (Client Component)\n\'use client\';\n\nimport { useFormState } from \'react-dom\';\nimport { loginAction } from \'@/app/actions\';\n\nconst initialState = { message: \'\', errors: {} };\n\nexport default function LoginForm() {\n const [state, dispatch] = useFormState(loginAction, initialState);\n\n return (\n <form action={dispatch}>\n <input name="email" type="email" required />\n {state.errors?.email && <p className="text-red-500">{state.errors.email}</p>}\n \n <input name="password" type="password" required />\n {state.errors?.password && <p>{state.errors.password}</p>}\n \n <button type="submit">로그인</button>\n <p>{state.message}</p>\n </form>\n );\n}',
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
          text: '캐시 무효화(Revalidation) 메커니즘',
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
          text: 'Server Actions의 가장 강력한 기능은 revalidatePath 또는 revalidateTag 호출 시, Next.js가 해당 경로에 필요한 업데이트된 RSC(React Server Component) 페이로드를 자동으로 계산하여 클라이언트에 전송한다는 점입니다.',
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
          text: '이 과정은 브라우저의 전체 새로고침 없이(Soft Navigation) 이루어지며, 클라이언트 라우터 캐시를 지능적으로 갱신합니다. 별도의 상태 관리 라이브러리로 데이터를 fetch 다시 할 필요가 사라집니다.',
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
          text: '주의: 직렬화(Serialization)와 클로저 이슈',
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
          text: 'Server Actions는 클라이언트 컴포넌트에서 prop으로 전달되거나 임포트될 때, 내부적으로 HTTP 엔드포인트처럼 동작합니다. 따라서 Server Action에 전달되는 인자와 반환값은 반드시 직렬화 가능(Serializable)해야 합니다.',
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
          text: '실수 포인트: Date 객체나 ORM 인스턴스를 직접 리턴하면 직렬화 에러가 발생합니다. .toISOString() 혹은 Plain Object 변환이 필요합니다.',
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
          text: '보안 포인트: Server Action 내부에서 클라이언트로부터 받은 데이터를 검증 없이 DB 쿼리에 사용해서는 안 됩니다. 항상 Zod와 같은 스키마 검증을 선행해야 합니다.',
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
          text: '정리: 프로덕션 적용 체크리스트',
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
          text: 'Progressive Enhancement: 자바스크립트 로드 전에도 기본 폼 제출이 동작하도록 <form> 태그와 action prop을 사용했는가?',
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
          text: 'Error Handling: useFormState의 에러 상태가 UI에 적절히 매핑되어 있으며, 서버 측 검증 로직이 누락되지 않았는가?',
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
          text: 'Cache Revalidation: 데이터 변경 후 revalidatePath 혹은 revalidateTag를 호출하여 최신 데이터를 UI에 반영하고 있는가?',
          styles: {},
        },
      ],
    },
  ],
};
