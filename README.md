# duck.log

Notion API를 활용한 개인 블로그 프로젝트

## 📋 프로젝트 소개

Notion을 CMS로 활용하여 블로그 포스트를 관리하고, Next.js로 정적 사이트를 생성하는 프로젝트입니다.

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **CMS**: Notion API
- **Testing**: Vitest
- **Deployment**: Vercel

## ✨ 주요 기능

- Notion 데이터베이스를 통한 블로그 포스트 관리
- SSG(Static Site Generation) + ISR(Incremental Static Regeneration)
- 다양한 Notion 블록 타입 지원 (heading, paragraph, code, image, video, bookmark 등)
- 반응형 디자인

## 🧪 테스트

이 프로젝트는 **Unit Test**를 통해 코드의 안정성과 신뢰성을 보장합니다.

### 테스트 통계

- **총 테스트 수**: 58개
- **테스트 커버리지**: 핵심 비즈니스 로직 100%
- **테스트 도구**: Vitest

### 테스트 범위

#### 1. 데이터 변환 로직 (`transforms.ts`)

- Notion API 응답 → Domain Model 변환
- RichText annotations 변환 (bold, italic, underline, strikethrough, code)
- 다양한 블록 타입 변환 (heading, paragraph, code, image, video, bookmark 등)
- Parent 정보 추출 및 hasChildren 처리

#### 2. 데이터 추출 로직 (`extracts.ts`)

- Notion 페이지 속성 추출 (title, categories, date, checkbox, text)
- 에지 케이스 처리 (null, undefined, 빈 값)

#### 3. 유틸리티 함수 (`dateUtils.ts`)

- 날짜 포맷팅
- ISO 형식 날짜 변환
- 에러 처리

### 테스트 실행

```bash
# 테스트 실행 (watch 모드)
npm test

# 테스트 실행 (한 번만)
npm run test:run

# 테스트 UI 실행
npm run test:ui
```

### 테스트 결과 예시

```
✓ tests/unit/dateUtils.test.ts (6 tests)
✓ tests/unit/extracts.test.ts (15 tests)
✓ tests/unit/transforms.test.ts (27 tests)

Test Files  3 passed (3)
     Tests  58 passed (58)
```

## 🚀 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- Notion API Key
- Notion Data Source ID

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일에 다음 변수 추가:
# NOTION_API_KEY=your_api_key
# NOTION_DATA_SOURCE_ID=your_data_source_id
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
duck.log/
├── src/
│   ├── app/              # Next.js App Router 페이지
│   ├── components/       # React 컴포넌트
│   ├── lib/              # 유틸리티 및 비즈니스 로직
│   │   └── notion/       # Notion API 관련 로직
│   └── models/           # TypeScript 타입 정의
├── tests/
│   ├── unit/             # Unit Test
│   │   ├── dateUtils.test.ts
│   │   ├── extracts.test.ts
│   │   └── transforms.test.ts
│   └── setup.ts          # 테스트 환경 설정
└── vitest.config.ts      # Vitest 설정
```

## 🧩 핵심 아키텍처

### 데이터 흐름

```
Notion API → transforms.ts → Domain Model → NotionRenderer → UI
```

1. **Notion API**: Notion 데이터베이스에서 블로그 포스트 데이터 가져오기
2. **transforms.ts**: Notion API 응답을 Domain Model로 변환
3. **Domain Model**: 타입 안전한 데이터 구조
4. **NotionRenderer**: Domain Model을 React 컴포넌트로 렌더링

### 테스트 전략

- **Unit Test**: 개별 함수의 동작 검증
- **Mock 데이터**: 실제 API 호출 없이 테스트 가능
- **Type Safety**: TypeScript로 타입 안정성 보장

## 📝 주요 학습 내용

- Next.js App Router 활용
- Notion API 통합
- TypeScript를 활용한 타입 안전한 코드 작성
- Unit Test 작성 및 테스트 전략 수립
- SSG/ISR을 활용한 성능 최적화

## 🔗 관련 링크

- [Notion API Documentation](https://developers.notion.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vitest Documentation](https://vitest.dev/)

## 📄 라이선스

MIT
