// Vitest 테스트 환경 설정

// client.ts가 모듈 로드 시점에 환경 변수를 체크하는 작업이 있어 따로 설정해주어야 함 
process.env.NOTION_API_KEY = "test-api-key";
process.env.NOTION_DATA_SOURCE_ID = "test-data-source-id";
