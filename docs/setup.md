# Setup Guide

## Requirements

- Node.js 20+
- PostgreSQL 15+

## 1) Install

```bash
npm install
```

## 2) Configure Environment Variables

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/devlog?schema=public"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_API_MOCKING="false"
HASHID_SALT="replace-with-random-secret"
```

## 3) Run DB Migration and Seed

```bash
npx prisma migrate dev
npx prisma db seed
```

## 4) Start Development Server

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Mock API (MSW)

개발 환경에서 mock API를 사용하려면 `.env`에 아래 값을 설정하세요.

```dotenv
NEXT_PUBLIC_API_MOCKING="true"
```
