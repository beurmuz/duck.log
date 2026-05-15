import { vi } from "vitest";

// client.ts가 모듈 로드 시점에 환경 변수를 체크하는 작업이 있어 따로 설정해주어야 함 
process.env.NOTION_API_KEY = "test-api-key";
process.env.NOTION_DATA_SOURCE_ID = "test-data-source-id";

// Next.js 전용 함수인 unstable_cache를 테스트 환경에서 모킹함
vi.mock("next/cache", () => ({
  unstable_cache: (fn: any) => fn,
}));
