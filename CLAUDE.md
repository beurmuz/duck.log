# 1. 프로젝트 개요
- 프로젝트명: musegram
- 프로젝트 목표: 나만의 인스타그램 형식의 기록지 만들기
- 사용 기술: Next.js, TypeScript

# 2. 프로젝트 구조

```
src/
├── app/             # Next.js App Router
│   ├── page.tsx     # 메인 페이지
│   └── layout.tsx   # 레이아웃
├── components/      # 재사용 가능한 컴포넌트
│   ├── UI/          # UI 컴포넌트
│   └── layout/      # 레이아웃 컴포넌트
├── models/          # 데이터 모델
└── lib/             # 유틸리티 함수
```

# 3. 개발 규칙

## 3.1. 스타일링
- CSS Modules 사용
- classnames 라이브러리 사용
    
    ````
    import classNames from "classnames/bind";
    import styles from './컴포넌트명.module.css';

    const cx = classNames.bind(styles);

    // 사용 예시
    <div className={cx('container', { active: isActive, 'text-large': size === 'large' })} />
    <div className={cx['container', 'active', 'text-large']}>
    ````

- 전역 스타일은 src/styles/globals.css에 정의
- 여백 및 폰트 사이즈 등은 단위를 rem를 사용하고, 반응형의 경우 % 단위를 사용할 것

## 3.2. 컴포넌트
- 재사용 가능한 컴포넌트는 src/components/UI에 정의
- 레이아웃 컴포넌트는 src/components/layout에 정의
- 컴포넌트는 TypeScript로 작성
- 컴포넌트는 props를 사용하여 상태 관리

## 3.3. 상태 관리
<!-- - 상태 관리는 React Context API 사용
- 전역 상태는 src/store에 정의 -->
- 컴포넌트별 상태는 useState 사용

## 3.4. API 통신
- API 통신은 fetch API 사용
- API 호출은 src/lib/api.ts에 정의
- API 응답은 TypeScript 인터페이스로 정의

<!-- ## 3.5. 테스트
- 테스트는 Jest 사용
- 테스트는 src/tests에 정의
- 테스트는 TypeScript로 작성 -->

# 4. 개발 워크플로우

1. 새로운 기능 개발 시 src/components/UI에 컴포넌트 생성
2. 컴포넌트 사용 시 src/app에 페이지 생성
3. 상태 관리가 필요하면 src/store에 상태 정의
4. API 통신이 필요하면 src/lib/api에 API 호출 정의
5. 테스트가 필요하면 src/tests에 테스트 정의

# 5. 배포
- 배포는 Vercel 사용
- 배포는 GitHub Actions 사용
- 배포는 npm run build 후 npm run start

<!-- # 6. 기타
- 커밋 메시지는 Conventional Commits 사용
- 브랜치명은 feature/feature-name 형식 사용
- PR 제목은 "feat: feature-name" 형식 사용 -->
